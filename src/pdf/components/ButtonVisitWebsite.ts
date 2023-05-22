import { getGoToWhite } from "../assets/goToWhiteImg"

export function getButtonVisitWebsite(
    link: string
){
    return `
    <a
        href="${link}"
        target="_blank"
        class="bg-black shadow-sm rounded-lg gap-3 px-4 py-1 w-fit flex flex-row items-center justify-center"
    >
        ${getGoToWhite()}
        <span
            class="font-dm-sans text-white text-base font-bold"
        >
            Visiter le site
        </span>
    </a>
    `
}