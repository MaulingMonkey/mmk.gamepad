:: Build the library's typescript documentation.

@setlocal
@if not defined MMK_GAMEPAD_DOCS_BRANCH set MMK_GAMEPAD_DOCS_BRANCH=master
@pushd "%~dp0.."
call "node_modules\.bin\typedoc" ^
    --out docs ^
    --mode file ^
    --sourcefile-url-prefix "https://github.com/MaulingMonkey/mmk.keyboard/blob/%MMK_GAMEPAD_DOCS_BRANCH%/src/" ^
    --exclude "**\impl\*.ts" ^
    --exclude "**\rawEventListeners\*.ts" ^
    src
@popd
@endlocal
:: Neither popd nor endlocal clear ERRORLEVEL
@exit /b %ERRORLEVEL%
