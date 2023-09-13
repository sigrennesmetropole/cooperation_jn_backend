import { getDivider } from "./PdfDivider";

export function getFooter(numPage: number) {
  const divider = getDivider();

  return `
    <div
        class="flex-row justify-between"
        style="
            margin-top: 45px;
            width: 100%;
        "
    >
        <div class="flex-column" style="margin-left: 30px;">
            ${divider}
            <div class="flex-row" style="margin-top: 20px;">
                <svg width="145" height="30" viewBox="0 0 145 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M94.9171 9.74476C95.5548 11.8994 97.3697 13.2215 100.264 13.2215C103.207 13.2215 105.218 11.8504 105.218 9.35301C105.218 7.29633 103.943 6.02315 100.362 5.53347C98.3508 5.23966 97.6641 4.74997 97.6641 3.7706C97.6641 2.6933 98.547 2.20361 99.8714 2.20361C101.49 2.20361 102.373 2.93814 102.716 4.35822L104.777 3.7706C104.237 1.51805 102.569 0.244873 99.8224 0.244873C97.1245 0.244873 95.3586 1.51805 95.3586 3.91751C95.3586 5.63141 96.2415 7.05149 99.7733 7.54118C102.079 7.83499 102.815 8.37364 102.815 9.45095C102.815 10.6262 101.883 11.2138 100.313 11.2138C98.4489 11.2138 97.3697 10.3813 96.8302 8.9123L94.9171 9.74476ZM84.616 5.68037C84.8613 3.72163 86.0386 2.35052 88.0988 2.35052C90.0118 2.35052 91.2872 3.52576 91.2872 5.68037H84.616ZM93.5436 6.21903C93.5436 2.35052 91.3853 0.293841 88.0988 0.293841C84.3708 0.293841 82.2615 2.88917 82.2615 6.75768C82.2615 10.6752 84.3708 13.2215 88.1969 13.2215C90.9438 13.2215 92.7097 11.8994 93.3474 9.79373L91.2382 9.10817C90.7967 10.6752 89.5213 11.1159 88.1969 11.1159C85.7933 11.1159 84.7141 9.59785 84.567 7.59015H93.5436V6.21903ZM71.6661 12.9767V3.86854C72.8924 5.04378 76.3752 10.1365 77.7486 12.9767H80.0051V0.489715H77.7977V8.86333C76.179 5.97418 73.9225 2.98711 71.5189 0.489715H69.4097V12.9767H71.6661ZM58.1766 12.9767V3.86854C59.4029 5.04378 62.8857 10.1365 64.2591 12.9767H66.5156V0.489715H64.3082V8.86333C62.6894 5.97418 60.433 2.98711 58.0785 0.489715H55.9692V12.9767H58.1766ZM44.7361 5.68037C44.9814 3.72163 46.1587 2.35052 48.2189 2.35052C50.1319 2.35052 51.4073 3.52576 51.4073 5.68037H44.7361ZM53.6637 6.21903C53.6637 2.35052 51.5054 0.293841 48.2189 0.293841C44.4909 0.293841 42.3816 2.88917 42.3816 6.75768C42.3816 10.6752 44.4909 13.2215 48.317 13.2215C51.0639 13.2215 52.8298 11.8994 53.4675 9.79373L51.3582 9.10817C50.9168 10.6752 49.6414 11.1159 48.317 11.1159C45.9134 11.1159 44.8342 9.59785 44.6871 7.59015H53.6637V6.21903ZM35.6614 2.54639C37.4273 2.54639 38.3593 3.37886 38.3593 4.79894C38.3593 6.07212 37.5744 6.95356 35.9066 6.95356H32.9144V2.54639H35.6614ZM37.8197 8.52055C40.0271 7.78602 40.7138 6.12109 40.7138 4.50513C40.7138 1.95877 38.9479 0.440747 35.9066 0.440747H30.707V12.9277H32.9144V8.86333H35.2199H35.4651L36.299 10.2344C37.7706 12.6339 38.3593 13.0256 40.7138 13.0256V10.92C39.4875 10.92 39.046 10.5283 38.114 9.01023L37.8197 8.52055Z" fill="black"/>
                    <path d="M136.023 22.3296C136.269 20.3709 137.446 18.9998 139.506 18.9998C141.419 18.9998 142.694 20.175 142.694 22.3296H136.023ZM145 22.9173C145 19.0487 142.842 16.9921 139.555 16.9921C135.827 16.9921 133.718 19.5874 133.718 23.4559C133.718 27.3734 135.827 29.9197 139.653 29.9197C142.4 29.9197 144.166 28.5976 144.804 26.492L142.694 25.8064C142.253 27.3734 140.978 27.8141 139.653 27.8141C137.25 27.8141 136.17 26.2961 136.023 24.2884H145V22.9173ZM126.703 17.1879H124.496V29.6749H132.786V27.6182H126.703V17.1879ZM116.01 27.7651C113.655 27.7651 112.036 26.0512 112.036 23.4069C112.036 20.8606 113.655 19.0487 116.01 19.0487C118.364 19.0487 119.983 20.8606 119.983 23.4069C119.983 26.0512 118.364 27.7651 116.01 27.7651ZM116.01 29.8708C119.738 29.8708 122.288 27.3244 122.288 23.4069C122.288 19.5874 119.787 16.9431 116.01 16.9431C112.233 16.9431 109.731 19.5874 109.731 23.4069C109.731 27.3244 112.282 29.8708 116.01 29.8708ZM100.362 23.8477V19.2446H103.256C105.022 19.2446 106.003 20.0281 106.003 21.5461C106.003 23.0642 105.022 23.8477 103.256 23.8477H100.362ZM98.1545 17.1879V29.6749H100.362V25.9043H103.06C106.739 25.9043 108.308 24.1415 108.308 21.5461C108.308 18.9508 106.739 17.1879 103.06 17.1879H98.1545ZM89.6684 27.7651C87.3138 27.7651 85.6951 26.0512 85.6951 23.4069C85.6951 20.8606 87.3138 19.0487 89.6684 19.0487C92.0229 19.0487 93.6416 20.8606 93.6416 23.4069C93.6416 26.0512 92.0229 27.7651 89.6684 27.7651ZM89.6684 29.8708C93.3964 29.8708 95.9471 27.3244 95.9471 23.4069C95.9471 19.5874 93.4454 16.9431 89.6684 16.9431C85.8913 16.9431 83.3896 19.5874 83.3896 23.4069C83.3896 27.3244 85.8913 29.8708 89.6684 29.8708ZM76.7184 19.2446C78.4843 19.2446 79.4163 20.0771 79.4163 21.4972C79.4163 22.7703 78.6315 23.6518 76.9637 23.6518H73.9715V19.2446H76.7184ZM78.8768 25.2188C81.0841 24.4842 81.7709 22.8193 81.7709 21.2034C81.7709 18.657 80.005 17.139 76.9637 17.139H71.7641V29.6259H73.9715V25.5616H76.277H76.5222L77.3561 26.9327C78.8277 29.3321 79.4163 29.7239 81.7709 29.7239V27.6182C80.5446 27.6182 80.1031 27.2265 79.1711 25.7085L78.8768 25.2188ZM65.5344 29.6749V19.2446H69.9492V17.1879H59.0594V19.2446H63.327V29.6749H65.5344ZM49.347 22.3296C49.5922 20.3709 50.7695 18.9998 52.8297 18.9998C54.7428 18.9998 56.0182 20.175 56.0182 22.3296H49.347ZM58.2746 22.9173C58.2746 19.0487 56.1163 16.9921 52.8297 16.9921C49.1017 16.9921 46.9925 19.5874 46.9925 23.4559C46.9925 27.3734 49.1017 29.9197 52.9278 29.9197C55.6748 29.9197 57.4407 28.5976 58.0784 26.492L55.9691 25.8064C55.5276 27.3734 54.2523 27.8141 52.9278 27.8141C50.5243 27.8141 49.4451 26.2961 49.2979 24.2884H58.2746V22.9173ZM55.3314 13.0746L50.8676 14.6416L51.4072 16.1596L55.871 14.6416L55.3314 13.0746ZM43.9512 17.1879H41.7929C40.3703 20.0771 39.095 22.9662 38.0158 26.2961H37.8686C36.8385 22.9662 35.5141 20.0771 34.1406 17.1879H31.9823L30.4617 29.6749H32.669L33.6501 21.0564C34.8274 23.7007 35.8575 26.394 36.7404 29.2832H39.1931C40.076 26.443 41.1061 23.7007 42.2834 21.0564L43.2644 29.6749H45.4718L43.9512 17.1879Z" fill="black"/>
                    <path d="M14.2744 22.7214C12.4594 20.126 11.2331 19.3426 8.68234 18.9508V21.3503C10.4482 21.5951 11.2821 22.5255 12.4104 24.1415C15.4516 28.4997 17.1685 30.2625 23.3491 29.9687V27.6672C18.591 27.961 16.9723 26.492 14.2744 22.7214ZM15.795 21.5461C18.3948 25.1208 19.7683 26.345 23.3491 26.0512V23.7497C20.7003 24.0435 19.4249 22.7214 17.6099 20.126C15.3535 16.9921 12.8518 15.2782 8.63329 15.0333V17.3838C11.6746 17.4818 13.6367 18.5101 15.795 21.5461ZM0 29.6259H2.40359V9.59782C1.6678 9.84267 0.735792 10.1365 0 10.4793V29.6259ZM6.67118 8.52052C5.93539 8.61845 5.00338 8.76536 4.26759 8.96123V29.6259H6.67118V8.52052ZM19.4249 10.822C19.4249 6.85559 16.2855 4.21129 10.1049 4.21129C6.86739 4.21129 2.99222 4.94582 0 6.17003V8.61845C2.74696 7.39424 6.72023 6.51281 10.1049 6.51281C14.5687 6.51281 17.0213 8.03083 17.0213 10.871C17.0213 12.5359 16.1874 14.005 14.6668 14.9354C15.3045 15.2782 15.9912 15.8168 16.5308 16.3065C18.3948 15.1313 19.4249 13.0746 19.4249 10.822ZM10.3992 0C6.96549 0 3.43369 0.734527 0.049053 1.8608V4.30923C3.77706 2.93811 7.30886 2.30152 10.3992 2.30152C17.4137 2.30152 21.5342 5.48447 21.5342 10.5282C21.5342 13.4663 20.2588 15.9637 17.8552 17.6287C18.3457 18.1673 18.8853 18.8039 19.3268 19.3426C22.319 17.2859 23.9378 14.005 23.9378 10.5282C23.8887 4.21129 18.7382 0 10.3992 0Z" fill="black"/>
                </svg>
            </div>
        </div>
        <div class="flex-row" style="margin-top: 50px; margin-right: 30px;">
            <span class="font-bold" style="font-size: 0.75rem; line-height: 1rem; ">
                ${numPage}/6
            </span>
        </div>
    </div>
    `;
}
