import { getGoToWhite } from "../assets/goToWhiteImg"

export function getButtonVisitWebsite(
    link: string
){
    return `
    <a
        href="${link}"
        target="_blank"
        class="bg-black rounded-lg gap-3 px-4 py-4 w-fit flex flex-row items-center justify-center"
        style=" text-decoration: underline black;"
    >
        ${getGoToWhite()}
        <span
            class="font-dm-sans text-white text-base font-bold "
          
        >
            Visiter le site
        </span>
    </a>
    `
}