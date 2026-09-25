FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["ActivosFijos.Api/ActivosFijos.Api.csproj", "ActivosFijos.Api/"]
COPY ["ActivosFijos.Application/ActivosFijos.Application.csproj", "ActivosFijos.Application/"]
COPY ["ActivosFijos.Infrastructure/ActivosFijos.Infrastructure.csproj", "ActivosFijos.Infrastructure/"]
COPY ["ActivosFijos.Domain/ActivosFijos.Domain.csproj", "ActivosFijos.Domain/"]
RUN dotnet restore "ActivosFijos.Api/ActivosFijos.Api.csproj"

COPY . .
RUN dotnet publish "ActivosFijos.Api/ActivosFijos.Api.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:5150
EXPOSE 5150

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ActivosFijos.Api.dll"]
