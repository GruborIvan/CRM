FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["CRMService.API/CRMService.API.csproj", "CRMService.API/"]
COPY ["CRMService.Application/CRMService.Application.csproj", "CRMService.Application/"]
COPY ["CRMService.Infrastructure/CRMService.Infrastructure.csproj", "CRMService.Infrastructure/"]
COPY ["CRMService.Domain/CRMService.Domain.csproj", "CRMService.Domain/"]
RUN dotnet restore "CRMService.API/CRMService.API.csproj"

COPY . .
RUN dotnet publish "CRMService.API/CRMService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "CRMService.API.dll"]
