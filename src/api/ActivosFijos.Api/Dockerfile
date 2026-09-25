FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["ActivosFijos.Api.csproj", "./"]
RUN dotnet restore "ActivosFijos.Api.csproj"

COPY . .
RUN dotnet publish "ActivosFijos.Api.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:5150
EXPOSE 5150

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ActivosFijos.Api.dll"]