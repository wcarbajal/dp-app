#!/bin/bash

echo "🚀 Optimizando proyecto dp-app para arranque rápido..."

echo "📦 Limpiando caché de node_modules..."
rm -rf node_modules/.vite
rm -rf node_modules/.cache

echo "🔧 Limpiando caché de npm..."
npm cache clean --force

echo "📝 Instalando dependencias optimizadas..."
npm install

echo "⚡ Proyecto optimizado! Ejecuta:"
echo "  npm run dev        - Arranque normal optimizado"
echo "  npm run dev:fast   - Arranque súper rápido (sin deps optimization)"
echo "  npm run clean      - Limpiar caché cuando sea necesario"

echo "✅ ¡Listo! El proyecto debería arrancar mucho más rápido ahora."