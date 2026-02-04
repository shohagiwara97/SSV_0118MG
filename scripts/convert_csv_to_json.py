#!/usr/bin/env python3
import argparse
import csv
import datetime as dt
import hashlib
import json
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


def load_json(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def slugify_name(name: str) -> str:
    safe = "".join(ch.lower() if ch.isalnum() else "-" for ch in name.strip())
    safe = "-".join(filter(None, safe.split("-")))
    if safe:
        return safe
    digest = hashlib.sha1(name.encode("utf-8")).hexdigest()[:8]
    return f"player-{digest}"


def normalize_name(name: str, aliases: Dict[str, str]) -> str:
    key = name.strip()
    return aliases.get(key, key)


def parse_float(value: str) -> Optional[float]:
    if value is None:
        return None
    v = str(value).strip()
    if v == "" or v.upper() == "N/A":
        return None
    v = v.replace(",", "")
    try:
        return float(v)
    except ValueError:
        return None


def apply_transform(value: Optional[float], transform: Optional[str]) -> Optional[float]:
    if value is None:
        return None
    if transform == "abs":
        return abs(value)
    return value


def parse_datetime_photon(value: str) -> Optional[dt.datetime]:
    if not value:
        return None
    v = value.strip()
    try:
        return dt.datetime.fromisoformat(v)
    except ValueError:
        return None


def parse_datetime_hawkin(date_value: str, time_value: Optional[str]) -> Optional[dt.datetime]:
    if not date_value:
        return None
    date_text = date_value.strip()
    time_text = (time_value or "").strip()
    for fmt in ("%m/%d/%Y %H:%M:%S", "%m/%d/%Y"):
        try:
            if time_text:
                return dt.datetime.strptime(f"{date_text} {time_text}", "%m/%d/%Y %H:%M:%S")
            return dt.datetime.strptime(date_text, fmt)
        except ValueError:
            continue
    return None


def read_csv_rows(source: Dict[str, Any]) -> List[Dict[str, str]]:
    path = Path(source["path"]).expanduser()
    delimiter = source.get("delimiter", ",")
    header_skip = int(source.get("header_skip", 0))
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        lines = f.readlines()
    data_lines = lines[header_skip:]
    if not data_lines:
        return []
    reader = csv.DictReader(data_lines, delimiter=delimiter)
    rows: List[Dict[str, str]] = []
    for row in reader:
        if not row:
            continue
        rows.append(row)
    return rows


def select_rows(
    rows: List[Dict[str, str]],
    source: Dict[str, Any],
    name_aliases: Dict[str, str]
) -> Dict[str, Tuple[Optional[dt.datetime], List[Dict[str, str]]]]:
    player_field = source["player_field"]
    date_field = source.get("date_field")
    time_field = source.get("time_field")
    format_name = source.get("format", "")
    row_select = source.get("row_select")
    grouped: Dict[str, List[Tuple[Optional[dt.datetime], Dict[str, str]]]] = defaultdict(list)

    for row in rows:
        name_raw = row.get(player_field, "").strip()
        if not name_raw:
            continue
        name = normalize_name(name_raw, name_aliases)
        timestamp: Optional[dt.datetime] = None
        if format_name == "photon" and date_field:
            timestamp = parse_datetime_photon(row.get(date_field, ""))
        elif format_name == "hawkin" and date_field:
            timestamp = parse_datetime_hawkin(row.get(date_field, ""), row.get(time_field, "") if time_field else None)
        grouped[name].append((timestamp, row))

    selected: Dict[str, Tuple[Optional[dt.datetime], List[Dict[str, str]]]] = {}
    for name, items in grouped.items():
        items_sorted = sorted(items, key=lambda x: x[0] or dt.datetime.min, reverse=True)
        latest_ts = items_sorted[0][0] if items_sorted else None
        if row_select == "latest":
            selected[name] = (latest_ts, [items_sorted[0][1]])
        else:
            selected[name] = (latest_ts, [item[1] for item in items])
    return selected


def aggregate_metrics(rows: List[Dict[str, str]], metrics: Dict[str, Any], agg: str) -> Dict[str, Optional[float]]:
    if agg not in {"avg", "min", "max"}:
        agg = "avg"
    values_map: Dict[str, List[float]] = {metric_id: [] for metric_id in metrics.keys()}
    for row in rows:
        for metric_id, meta in metrics.items():
            value = parse_float(row.get(meta["column"], ""))
            value = apply_transform(value, meta.get("transform"))
            if value is None:
                continue
            values_map[metric_id].append(value)

    result: Dict[str, Optional[float]] = {}
    for metric_id, values in values_map.items():
        if not values:
            result[metric_id] = None
            continue
        if agg == "min":
            result[metric_id] = min(values)
        elif agg == "max":
            result[metric_id] = max(values)
        else:
            result[metric_id] = sum(values) / len(values)
    return result


def extract_metrics(rows: List[Dict[str, str]], metrics: Dict[str, Any]) -> Dict[str, Optional[float]]:
    if not rows:
        return {metric_id: None for metric_id in metrics.keys()}
    row = rows[0]
    result: Dict[str, Optional[float]] = {}
    for metric_id, meta in metrics.items():
        value = parse_float(row.get(meta["column"], ""))
        result[metric_id] = apply_transform(value, meta.get("transform"))
    return result


def score_values(
    values_by_player: Dict[str, Optional[float]],
    direction: str,
    score_min: float,
    score_max: float,
    rounding: str
) -> Tuple[Dict[str, Optional[int]], Dict[str, Optional[int]]]:
    items = [(name, value) for name, value in values_by_player.items() if value is not None]
    if not items:
        return {name: None for name in values_by_player}, {name: None for name in values_by_player}

    values = [value for _, value in items]
    min_v, max_v = min(values), max(values)
    denom = max_v - min_v

    def normalize(value: float) -> float:
        if denom == 0:
            return (score_min + score_max) / 2
        if direction == "lower_is_better":
            ratio = (max_v - value) / denom
        else:
            ratio = (value - min_v) / denom
        return score_min + ratio * (score_max - score_min)

    def round_score(val: float) -> int:
        if rounding == "floor":
            return int(val)
        if rounding == "ceil":
            return int(val) if val == int(val) else int(val) + 1
        return int(round(val))

    score_map: Dict[str, Optional[int]] = {}
    for name, value in values_by_player.items():
        if value is None:
            score_map[name] = None
        else:
            score_map[name] = round_score(normalize(value))

    reverse = direction != "lower_is_better"
    ranked = sorted(items, key=lambda x: x[1], reverse=reverse)
    rank_map: Dict[str, Optional[int]] = {name: None for name in values_by_player}
    rank = 1
    for name, _ in ranked:
        rank_map[name] = rank
        rank += 1

    return score_map, rank_map


def build_output(config: Dict[str, Any]) -> Dict[str, Any]:
    name_aliases = config.get("name_aliases", {})
    sources = config.get("sources", {})
    score_range = config.get("score_range", {"min": 70, "max": 95})
    score_min = score_range.get("min", 70)
    score_max = score_range.get("max", 95)
    rounding = config.get("score_rounding", "round")

    metrics_by_source: Dict[str, Dict[str, Dict[str, Optional[float]]]] = defaultdict(dict)
    player_meta: Dict[str, Dict[str, Any]] = {}

    for source_id, source in sources.items():
        rows = read_csv_rows(source)
        selected = select_rows(rows, source, name_aliases)
        aggregate = source.get("aggregate")
        metrics = source.get("metrics", {})
        position_field = source.get("position_field")

        for name, (timestamp, rows_for_player) in selected.items():
            if aggregate:
                metrics_map = aggregate_metrics(rows_for_player, metrics, aggregate)
            else:
                metrics_map = extract_metrics(rows_for_player, metrics)

            metrics_by_source[source_id][name] = metrics_map
            meta = player_meta.setdefault(name, {})
            if timestamp:
                existing = meta.get("measuredAt")
                if not existing:
                    meta["measuredAt"] = timestamp.isoformat()
                else:
                    try:
                        existing_dt = dt.datetime.fromisoformat(existing)
                    except ValueError:
                        existing_dt = None
                    if not existing_dt or timestamp > existing_dt:
                        meta["measuredAt"] = timestamp.isoformat()
            if position_field:
                for row in rows_for_player:
                    pos = (row.get(position_field) or "").strip()
                    if pos:
                        meta["position"] = pos
                        break

    player_names = sorted(metrics_by_source[source_id].keys() for source_id in metrics_by_source)
    flat_names = sorted({name for names in player_names for name in names})

    categories = config.get("categories", [])
    category_scores: Dict[str, Dict[str, Optional[int]]] = defaultdict(dict)
    category_ranks: Dict[str, Dict[str, Optional[int]]] = defaultdict(dict)

    for category in categories:
        source_id = category["source"]
        metric_id = category["metric_id"]
        direction = category.get("direction", "higher_is_better")
        values = {
            name: metrics_by_source.get(source_id, {}).get(name, {}).get(metric_id)
            for name in flat_names
        }
        scores, ranks = score_values(values, direction, score_min, score_max, rounding)
        category_scores[category["id"]] = scores
        category_ranks[category["id"]] = ranks

    sections = config.get("sections", [])

    players: List[Dict[str, Any]] = []
    for name in flat_names:
        player_id = slugify_name(name)
        meta = player_meta.get(name, {})
        metrics_block: Dict[str, Any] = {}
        for source_id, source_metrics in metrics_by_source.items():
            if name not in source_metrics:
                continue
            metrics_block[source_id] = {
                metric_id: {
                    "value": value,
                    "unit": sources[source_id]["metrics"][metric_id].get("unit")
                }
                for metric_id, value in source_metrics[name].items()
            }

        player_categories = []
        for category in categories:
            cat_id = category["id"]
            player_categories.append(
                {
                    "id": cat_id,
                    "label": category["label"],
                    "score": category_scores[cat_id].get(name),
                    "rank": category_ranks[cat_id].get(name),
                    "vendor": category.get("vendor")
                }
            )

        player_sections = []
        for section in sections:
            source_id = section["source"]
            metric_defs = sources[source_id]["metrics"]
            metrics = []
            for metric_id in section["metric_ids"]:
                value = metrics_by_source.get(source_id, {}).get(name, {}).get(metric_id)
                unit = metric_defs[metric_id].get("unit")
                display = None
                if value is not None and unit and unit != "vendor":
                    display = f"{value} {unit}"
                elif value is not None:
                    display = f"{value}"
                metrics.append(
                    {
                        "id": metric_id,
                        "label": metric_defs[metric_id].get("label", metric_id),
                        "value": value,
                        "unit": unit,
                        "display": display
                    }
                )
            player_sections.append(
                {
                    "id": section["id"],
                    "title": section["title"],
                    "vendor": section.get("vendor"),
                    "metrics": metrics
                }
            )

        players.append(
            {
                "id": player_id,
                "name": name,
                "position": meta.get("position"),
                "measuredAt": meta.get("measuredAt"),
                "categories": player_categories,
                "sections": player_sections,
                "metrics": metrics_block
            }
        )

    return {
        "event": config.get("event", {}),
        "generatedAt": dt.datetime.now().isoformat(),
        "scoreRange": {
            "min": score_min,
            "max": score_max
        },
        "players": players
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert CSV files to JSON for the app.")
    parser.add_argument(
        "--config",
        default="scripts/mapping.json",
        help="Path to mapping config JSON"
    )
    parser.add_argument(
        "--output",
        default="Data/converted/report_2026-01-18.json",
        help="Output JSON file path"
    )
    args = parser.parse_args()

    config_path = Path(args.config)
    output_path = Path(args.output)
    config = load_json(config_path)
    data = build_output(config)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
