FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
WORKDIR /src/gerencia_saloes_API

RUN dotnet restore gerencia_saloes_API.csproj
RUN dotnet publish -c Release -o /app/publish gerencia_saloes_API.csproj

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "gerencia_saloes_API.dll"]