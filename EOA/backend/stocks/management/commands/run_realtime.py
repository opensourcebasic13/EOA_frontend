import time
import threading

from django.core.management.base import BaseCommand

from stocks.models import Stock, StockPrice, StockChartPoint
from stocks.services.market_data import fetch_stock_quote, fetch_stock_chart
from tweets.services.x_stream_client import SUPPORTED_STOCKS

STOCK_INTERVAL = 60   # 1분 (yfinance 최소 폴링 간격)


class Command(BaseCommand):
    help = "Stock realtime update (10min)"

    def handle(self, *args, **options):
        self.stdout.write("[run_realtime] start (stock 1min)")

        stock_thread = threading.Thread(target=self._stock_loop, daemon=True)
        stock_thread.start()

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stdout.write("[run_realtime] stopped")

    def _stock_loop(self):
        while True:
            self._update_all_stocks()
            self.stdout.write(f"[stock] next update in {STOCK_INTERVAL}s")
            time.sleep(STOCK_INTERVAL)

    def _update_all_stocks(self):
        for item in SUPPORTED_STOCKS:
            ticker = item["ticker"]
            try:
                stock, _ = Stock.objects.update_or_create(
                    ticker=ticker,
                    defaults={
                        "name": item["name"],
                        "market": item["market"],
                        "logo_url": item.get("logo_url", ""),
                    },
                )
                quote = fetch_stock_quote(ticker)
                if quote["current_price"]:
                    StockPrice.objects.update_or_create(
                        stock=stock,
                        defaults={
                            "current_price": quote["current_price"],
                            "currency": quote["currency"],
                            "change_rate": quote["change_rate"],
                            "change_amount": quote["change_amount"],
                            "volume": quote["volume"],
                        },
                    )
                    self.stdout.write(
                        f"[stock] {ticker} ${quote['current_price']} ({quote['change_rate']:+.2f}%)"
                    )
                chart = fetch_stock_chart(ticker)
                if chart:
                    StockChartPoint.objects.filter(stock=stock).delete()
                    StockChartPoint.objects.bulk_create([
                        StockChartPoint(
                            stock=stock,
                            time=p["time"],
                            price=p["price"],
                            volume=p["volume"],
                        )
                        for p in chart
                    ])
            except Exception as e:
                self.stdout.write(f"[stock] {ticker} error: {e}")
