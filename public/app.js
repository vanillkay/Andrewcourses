

const toCurrency = price => {
    return new Intl.NumberFormat('ua', {
        currency: 'UAH',
        style: 'currency'
    }).format(price);
}

const toDate = date => {
    return new Intl.DateTimeFormat('ua', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.date').forEach(item => {
    item.textContent = toDate(item.textContent);
})


document.querySelectorAll('.price').forEach(item => {
    item.textContent = toCurrency(item.textContent);
})




const $card = document.querySelector('#card');

if ($card) {
    $card.addEventListener('click', evt => {
        if (evt.target.classList.contains('js-remove')) {
            const id = evt.target.dataset.id;
            const csrf = evt.target.dataset.csrf
            fetch('card/remove' + id, {
                method: 'delete',
                headers:{
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
                .then(card => {
                    if (card.courses.length){
                        const html = card.courses.map(item => {
                            return `
                             <tr>
                    <td>${item.title}</td>
                    <td>${item.count}</td>
                    <td>
                        <button class="btn btn-small js-remove" data-id="${item.id}">Удалить</button>
                    </td>
                </tr>`}).join('');
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = toCurrency(card.price);
                    }else {
                        $card.innerHTML = '<p>Корзина пуста</p>'
                    }
                });
        }
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'), );