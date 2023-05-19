export function getPdfStyle(){
    return `
        .page {
            page-break-after: always;
        }

        .margin-x-30 {
            margin-left: 30px;
            margin-right: 30px;
        }

        .flex-row {
            display: flex;
            flex-direction: row;
        }

        .flex-column {
            display: flex;
            flex-direction: column;
        }

        .box-white {
            gap: 0.75rem;
            width: 100%;
            background-color: white;
            border-radius: 0.75rem;
            margin-left: auto;
            margin-right: auto;
            font-family: DM Sans;
            padding: 1.5rem;
        }

        .justify-between{
            justify-content: space-between;
        }

        items-center {
            align-items: center;
        }

        p-0 {
            padding: 0px;
        }

        gap-2 {
            gap: 0.5rem;
        }

        grow {
            flex-grow: 1;
        }

        .text-2xl {
            font-size: 1.5rem/* 24px */;
            line-height: 2rem/* 32px */;
        }

        text-xs {
            font-size: 0.75rem/* 12px */;
            line-height: 1rem/* 16px */;
        }

        .text-sm {
            font-size: 0.875rem/* 14px */;
            line-height: 1.25rem/* 20px */;
        }

  
        .font-normal {
            font-weight: 400;
        }

        .font-medium {
            font-weight: 500;
        }

        .font-bold {
            font-weight: 700;
        }

        .px-2 {
            padding-left: 0.5rem/* 8px */;
            padding-right: 0.5rem/* 8px */;
        }

        .mt-2 {
            margin-top: 0.5rem/* 8px */;
        }

        .gap-4 {
            gap: 1rem/* 16px */;
        }

        .font-dm-sans {
            font-family: DM Sans;
        }

        .text-base {
            font-size: 1rem/* 16px */;
            line-height: 1.5rem/* 24px */;
        }
    `
}