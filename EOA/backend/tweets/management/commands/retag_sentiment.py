from django.core.management.base import BaseCommand
from tweets.models import TweetPost
from tweets.services.sentiment import analyze_sentiment


class Command(BaseCommand):
    help = "기존 트윗의 sentiment를 재분석합니다."

    def handle(self, *args, **options):
        tweets = TweetPost.objects.all()
        updated = 0
        for tweet in tweets:
            new_sentiment = analyze_sentiment(tweet.content)
            if tweet.sentiment != new_sentiment:
                tweet.sentiment = new_sentiment
                tweet.save(update_fields=["sentiment"])
                updated += 1
            preview = tweet.content[:60].encode("cp949", errors="replace").decode("cp949")
            self.stdout.write(f"[{tweet.stock.ticker}] {new_sentiment}: {preview}")

        self.stdout.write(self.style.SUCCESS(f"완료: {updated}개 업데이트"))
