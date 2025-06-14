// components/password-options-form.tsx
"use client"

import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { RefreshCw } from "lucide-react"
import type { PasswordOptions } from "../../lib/password-utils"

interface PasswordOptionsFormProps {
    theme: 'light' | 'dark'
    options: PasswordOptions
    setOptions: (options: PasswordOptions) => void
    onGenerate: () => void
}

export const PasswordOptionsForm = ({
    theme,
    options,
    setOptions,
    onGenerate
}: PasswordOptionsFormProps) => {
    // const inputClasses = theme === 'dark'
    //     ? "bg-gray-800/50 border-gray-700"
    //     : "bg-gray-50 border-gray-300"

    const labelClasses = theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
    const checkboxClasses = theme === 'dark'
        ? "bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
        : "bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500"

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="passwordLength" className={labelClasses}>
                        Password Length: {options.length}
                    </Label>
                    <input
                        id="passwordLength"
                        type="range"
                        min="4"
                        max="32"
                        value={options.length}
                        onChange={(e) => setOptions({ ...options, length: Number.parseInt(e.target.value) })}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="uppercase"
                            checked={options.includeUppercase}
                            onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                            className={`rounded ${checkboxClasses}`}
                        />
                        <Label htmlFor="uppercase" className={labelClasses}>
                            Uppercase (A-Z)
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="lowercase"
                            checked={options.includeLowercase}
                            onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                            className={`rounded ${checkboxClasses}`}
                        />
                        <Label htmlFor="lowercase" className={labelClasses}>
                            Lowercase (a-z)
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="numbers"
                            checked={options.includeNumbers}
                            onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                            className={`rounded ${checkboxClasses}`}
                        />
                        <Label htmlFor="numbers" className={labelClasses}>
                            Numbers (0-9)
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="symbols"
                            checked={options.includeSymbols}
                            onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                            className={`rounded ${checkboxClasses}`}
                        />
                        <Label htmlFor="symbols" className={labelClasses}>
                            Symbols (!@#$%)
                        </Label>
                    </div>
                </div>
            </div>

            <Button
                onClick={onGenerate}
                className="w-full bg-purple-800 hover:bg-purple-700 text-white"
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Password
            </Button>
        </>
    )
}