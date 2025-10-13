@echo off
echo 🔧 Optimizando Language Server de VS Code...

echo 📁 Limpiando archivos temporales de TypeScript...
if exist .tsbuildinfo del /q .tsbuildinfo
if exist **/.tsbuildinfo del /q /s **/.tsbuildinfo

echo 🧹 Limpiando cache de VS Code...
if exist "%APPDATA%\Code\User\workspaceStorage" (
    for /d %%i in ("%APPDATA%\Code\User\workspaceStorage\*") do (
        if exist "%%i\state.vscdb" del /q "%%i\state.vscdb"
    )
)

echo 📦 Limpiando cache de TypeScript Language Server...
if exist "%APPDATA%\npm\_logs" rmdir /s /q "%APPDATA%\npm\_logs" 2>nul
if exist "%TEMP%\vscode-typescript" rmdir /s /q "%TEMP%\vscode-typescript" 2>nul

echo 🔄 Limpiando cache de Yarn...
yarn cache clean

echo 📋 Configuración de VS Code optimizada
echo ✅ Optimización completada
echo 💡 Tip: Reinicia VS Code para aplicar todos los cambios

pause