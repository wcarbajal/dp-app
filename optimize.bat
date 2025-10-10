@echo off
echo 🚀 OPTIMIZACIÓN YARN para dp-app...

echo 📦 Limpiando caché de Vite...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist "dist" rmdir /s /q "dist"

echo 🧶 Limpiando caché de Yarn...
yarn cache clean

echo 🏎️ Instalando con Yarn (más rápido)...
yarn install

echo ⚡ COMANDOS DISPONIBLES:
echo   yarn dev           - Arranque normal
echo   yarn dev:fast      - Arranque rápido (sin deps optimization)
echo   yarn dev:force     - Arranque forzando caché
echo   yarn clean         - Limpiar caché de Vite
echo   yarn reset         - Reinstalación completa

echo.
echo 🎯 RECOMENDACIÓN: Usa 'yarn dev:fast' para máxima velocidad
echo.
echo ✅ ¡Optimización completa! Prueba ahora: yarn dev
pause