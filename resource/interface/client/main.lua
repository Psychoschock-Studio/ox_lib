--[[
    https://github.com/overextended/ox_lib

    This file is licensed under LGPL-3.0 or higher <https://www.gnu.org/licenses/lgpl-3.0.en.html>

    Copyright © 2025 Linden <https://github.com/thelindat>
]]

---@alias IconProp 'fas' | 'far' | 'fal' | 'fat' | 'fad' | 'fab' | 'fak' | 'fass'

local keepInput = IsNuiFocusKeepingInput()

function lib.setNuiFocus(allowInput, disableCursor)
    keepInput = IsNuiFocusKeepingInput()
    SetNuiFocus(true, not disableCursor)
    SetNuiFocusKeepInput(allowInput)
end

function lib.resetNuiFocus()
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(keepInput)
end

---@param r number Red value (0-255)
---@param g number Green value (0-255)
---@param b number Blue value (0-255)
function lib.setThemeColor(r, g, b)
    SendNUIMessage({
        action = 'setThemeColor',
        data = { r = r, g = g, b = b }
    })
end