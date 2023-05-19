import { getDivider } from './PdfDivider';

export function getHeader(numPage: number){
    const divider = getDivider()
    let textHeader = 'Votre simulation d’installation photovoltaïque'
    if([5, 6].includes(numPage)){
        textHeader = 'Plus d’information pour concrétiser votre projet'
    }
    return `
        <div 
            style="
                display: flex; flex-direction: column; 
                margin-top: 45px; 
                width: 100%;
                height: fit-content;
            "
        >
            ${divider}
            <span class="font-bold text-2xl" style="margin-top: 5px; flex-grow: 1">
                ${textHeader}
            </span>
        </div>
    `
}