
export function hideById(id: string) {
    try {
        const element = document.getElementById(id) as HTMLCanvasElement | HTMLButtonElement;
        element.style.display = "none";
    } catch (error: any) {
    }
}

export function showById(id: string, display = "block") {
    try {
        const element = document.getElementById(id) as HTMLCanvasElement | HTMLButtonElement;
        element.style.display = display;
    } catch (error: any) {
    }
}
