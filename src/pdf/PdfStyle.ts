export function getPdfStyle () {
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
            background-color: white;
            border-radius: 0.75rem;
            font-family: DM Sans;
            padding: 1.5rem;
        }

        .justify-between{
            justify-content: space-between;
        }

        .justifty-center {
            justify-content: center;
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

        .text-xs {
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

        .text-lg {
            font-size: 1.125rem/* 18px */;
            line-height: 1.75rem/* 28px */;
        }

        .text-center {
            text-align: center;
        }

        .m-0 {
            margin: 0px;
        }

        .p-0 {
            padding: 0px;
        }

        .items-center {
            align-items: center;
        }

        .p-0 {
            padding: 0px;
        }

        .gap-2 {
            gap: 0.5rem;
        }

        .grow {
            flex-grow: 1;
        }

        .mt-8 {
            margin-top: 2rem;
        }

        .relative {
            position: relative;
        }

        .absolute {
            position: absolute;
        }

        .left-[26%] {
            left: 26%;
        }

        .-top-3 {
            top: -0.75rem;
        }

        .w-fit {
            width: fit-content;
        }

        .h-[250px] {
            height: 250px;
        }

        .w-max-[250px] {
            max-width: 250px;
        }

        .px-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }

        .py-4 {
            padding-top: 1rem;
            padding-bottom: 1rem;
        }

        .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        .py-1 {
            padding-top: 0.25rem/* 4px */;
            padding-bottom: 0.25rem;
        }

        .text-3xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
        }

        .h-[60px] {
            height: 60px;
        }

        .h-[48px] {
            height: 48px;
        }

        .w-[160px] {
            width: 160px;
        }

        .mt-4 {
            margin-top: 1rem;
        }

        .text-center {
            text-align: center;
        }

        .w-[418px] {
            width: 418px;
        }

        .pb-4 {
            padding-bottom: 1rem;
        }

        .border {
            border: 1px solid;
        }

        .flex-1 {
            flex: 1;
        }

        
        .border-dashed {
            border-style: dashed;
        }

        .border-r-0 {
            border-right-width: 0;
        }

        .border-l-0 {
            border-left-width: 0;
        }

        .border-l {
            border-left-width: 1px;
        }

        .border-orange-300 {
            border-color: #F59E0B;
        }

        .border-green-400 {
            border-color: #10B981;
        }

        .border-indigo-300 {
            border-color: #6366F1;
        }

        .bg-orange-50 {
            background-color: #FFF7ED;
        }

        .bg-green-50 {
            background-color: #ECFDF5;
        }

        .bg-violet-50 {
            background-color: #F3F4F6;
        }

        .text-amber-600 {
            color: #D97706;
        }

        .text-emerald-600 {
            color: #059669;
        }

        .text-indigo-600 {
            color: #4F46E5;
        }

        .bg-amber-500 {
            background-color: #F59E0B;
        }

        .bg-emerald-500 {
            background-color: #10B981;
        }

        .bg-indigo-600 {
            background-color: #4F46E5;
        }

        .bg-indigo-200 {
            background-color: #C7D2FE;
        }

        .border-indigo-200 {
            border-color: #C7D2FE;
        }

        .bg-black {
            background-color: #000000;
        }

        .text-white {
            color: #FFFFFF;
        }

        .rounded-full {
            border-radius: 9999px;
        }

        .rounded-lg {
            border-radius: 0.5rem;
        }

        .rounded-r-lg {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
        }

        .rounded-l-lg {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
        }

        .px-4 {
            padding-left: 1rem; /* 16px */
            padding-right: 1rem; /* 16px */
        }

        .py-3 {
            padding-top: 0.75rem; /* 12px */
            padding-bottom: 0.75rem; /* 12px */
        }
        
        .py-[19px] {
            padding-top: 19px;
            padding-bottom: 19px;
        }
        
        .gap-3 {
            gap: 0.75rem; /* 12px */
        }
        
        .bg-amber-50 {
            background-color: #FFFBEB;
        }
        
        .border-amber-200 {
            border-color: #FDE68A;
        }
        
        .text-amber-900 {
            color: #78350F;
        }
        
        .w-5 {
            width: 1.25rem; /* 20px */
        }
        
        .h-5 {
            height: 1.25rem; /* 20px */
        }
        
        .border-l-4 {
            border-left-width: 4px;
        }

        .border-t-0 {
            border-top: none;
        }
        
        .border-b-0 {
            border-bottom: none;
        }
        
        .border-r-0 {
            border-right: none;
        }
        
        
        .pl-3 {
            padding-left: 0.75rem/* 12px */;
        }
        
        .ml-10 {
            margin-left: 2.5rem/* 40px */;
        }
        
        .mb-4 {
            margin-bottom: 1rem/* 16px */;
        }
        
        .mt-10 {
            margin-top: 2.5rem/* 40px */;
        }
        
        .ml-6 {
            margin-left: 1.5rem/* 24px */;
        }
        
        .ml-2 {
            margin-left: 0.5rem/* 8px */;
        }

        .border-l-2 {
            border-left-width: 2px;
        }

        .ml-3 {
            margin-left: 0.75rem/* 12px */;
        }
        
        .w-6 {
            width: 1.5rem/* 24px */;
        }
        
        .h-6 {
            height: 1.5rem/* 24px */;
        }
        
        .rounded-sm {
            border-radius: 0.125rem/* 2px */;
        }
        
        .border-amber-500 {
            border-color: #F59E0B;
        }
        
        .border-teal-700 {
            border-color: #2C7A7B;
        }

        .h-fit {
            height: fit-content;
        }

        .border-neutral-300 {
            border-color: #d1d5db;
        }

        .px-5 {
            padding-left: 1.25rem; /* 20px */
            padding-right: 1.25rem; /* 20px */
        }

        .py-8 {
            padding-top: 2rem; /* 32px */
            padding-bottom: 2rem; /* 32px */
        }

        .underline {
            text-decoration: underline;
        }

        .gap-8 {
            gap: 2rem; /* 32px */
        }

        .bg-white {
            background-color: #ffffff;
        }

        .shadow-sm {
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .w-[100%] {
            width: 100%;
        }
        
        .h-fit {
            height: fit-content;
        }
        
        .gap-6 {
            gap: 1.5rem; /* 24px */
        }
        
        .rounded-xl {
            border-radius: 1.5rem; /* 24px */
        }
        
        .py-6 {
            padding-top: 1.5rem; /* 24px */
            padding-bottom: 1.5rem; /* 24px */
        }
        
        .px-8 {
            padding-left: 2rem; /* 32px */
            padding-right: 2rem; /* 32px */
        }
        
        .mx-auto {
            margin-left: auto;
            margin-right: auto;
        }
        
        .bg-slate-100 {
            background-color: #F1F5F9; /* Adjust this value to your needs */
        }
        
        .p-6 {
            padding: 1.5rem; /* 24px */
        }
        
        .py-[18px] {
            padding-top: 18px;
            padding-bottom: 18px;
        }
        
        .justify-between {
            justify-content: space-between;
        }
        
        .h-10 {
            height: 2.5rem; /* 40px */
        }
        
        .w-10 {
            width: 2.5rem; /* 40px */
        }
        
        .w-[79px] {
            width: 79px;
        }
        
        .w-[34px] {
            width: 34px;
        }
        
        .w-3.5 {
            width: 0.875rem
        }

        .h-3.5 {
            height: 0.875rem
        }

        .mt-1 {
            margin-top: 0.25rem
        }
        
        .decoration-1 {
            text-decoration-thickness: 1px;
        }

        .color-black {
            color: #000000;
        }

    `
}
