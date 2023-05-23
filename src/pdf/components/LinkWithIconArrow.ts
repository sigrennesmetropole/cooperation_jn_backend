import { getImg } from '../ImgService'
import { getExpandImg } from '../assets/expandImg'
export function getLinkWithIconArrow (
  link: string
) {
  return `
        <a
            href="${link}"
            target="_blank"
            class="flex-row cursor-pointer w-fit color-black"
        >
            <p class="underline decoration-1 font-medium text-base">
                Accéder à la page
            </p>
            <div class="w-3.5 h-3.5 ml-2" style="margin-top: 23px; ">
                ${getExpandImg()}
            </div>
        </a>
    `
}
