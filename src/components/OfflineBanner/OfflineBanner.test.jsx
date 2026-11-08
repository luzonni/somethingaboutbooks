import { describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import OfflineBanner from "."

describe("OfflineBanner", () => {
    it("aparece ao perder a conexão e some ao voltar", () => {
        const onLine = vi.spyOn(navigator, "onLine", "get").mockReturnValue(true)
        render(<OfflineBanner />)
        expect(screen.queryByText(/sem internet/)).toBeNull()

        onLine.mockReturnValue(false)
        act(() => window.dispatchEvent(new Event("offline")))
        expect(screen.getByText(/sem internet/)).toBeTruthy()

        act(() => window.dispatchEvent(new Event("online")))
        expect(screen.queryByText(/sem internet/)).toBeNull()
    })
})
