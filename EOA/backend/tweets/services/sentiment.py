_BULLISH = [
    "buy", "bullish", "rally", "surge", "soar", "jump", "gain", "strong",
    "growth", "beat", "record", "high", "upside", "upgrade", "outperform",
    "positive", "opportunity", "potential", "breakout", "momentum", "moon",
    "long", "calls", "rise", "rising", "bull", "undervalued", "cheap",
]
_BEARISH = [
    "sell", "bearish", "drop", "fall", "decline", "crash", "loss", "weak",
    "miss", "risk", "concern", "warning", "downgrade", "underperform",
    "negative", "overvalued", "expensive", "short", "puts", "dump",
    "avoid", "caution", "volatile", "down", "cut", "layoff", "bear",
]


def _keyword_sentiment(text: str) -> str:
    lower = text.lower()
    bull = sum(1 for w in _BULLISH if w in lower)
    bear = sum(1 for w in _BEARISH if w in lower)
    if bull > bear:
        return "positive"
    if bear > bull:
        return "negative"
    return "neutral"


_pipeline = None


def _finbert_sentiment(text: str) -> str:
    global _pipeline
    try:
        if _pipeline is None:
            from transformers import pipeline
            _pipeline = pipeline(
                "text-classification",
                model="ProsusAI/finbert",
                truncation=True,
                max_length=512,
            )
        result = _pipeline(text[:512])[0]
        label = result["label"].lower()
        return label if label in ("positive", "negative", "neutral") else "neutral"
    except Exception:
        return None


def analyze_sentiment(text: str) -> str:
    """FinBERT 우선, 미설치 시 키워드 기반으로 감성 분석."""
    if not text or not text.strip():
        return "neutral"
    result = _finbert_sentiment(text)
    if result is not None:
        return result
    return _keyword_sentiment(text)
