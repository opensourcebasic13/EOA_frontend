from django.contrib import admin
from django.urls import path, include
from stocks.views import watchlist_stocks
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from config.views import health_check

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/users/", include("users.urls")),
    path("api/stocks/watchlist/", watchlist_stocks),
    path("api/stocks/", include("stocks.urls")),
    path("api/", include("tweets.urls")),
    path("", health_check),
    path("api/health/", health_check),
]
