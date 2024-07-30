module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary_btn: '#1976d2',
                black_btn: '#031C30',
                mute_border: '#E5E7EB',
                primary_color: '#1976d2',
                reset_color: '#be4e02'
            }
        }
    },
    plugins: [require('flowbite/plugin')]
};
