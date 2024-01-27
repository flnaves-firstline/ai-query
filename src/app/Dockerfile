# Build Frontend (React App)
FROM node:14 AS build-frontend
WORKDIR /frontend
COPY ./PatientQuery.Front /frontend
RUN npm install
RUN npm run build

# Build Backend (.NET 6 App)
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-backend
WORKDIR /sources
COPY ./ /sources
COPY --from=build-frontend /frontend/output /sources/PatientQuery.Back/wwwroot
RUN dotnet publish -c release -o /app

# Run App
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-backend /app ./
EXPOSE 80
ENTRYPOINT ["dotnet", "PatientQuery.Back.dll"]
