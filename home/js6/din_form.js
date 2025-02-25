const formDef1 =
    [
        { label: 'Название сайта:', kind: 'longtext', name: 'sitename' },
        { label: 'URL сайта:', kind: 'longtext', name: 'siteurl' },
        { label: 'Посетителей в сутки:', kind: 'number', name: 'visitors' },
        { label: 'E-mail для связи:', kind: 'shorttext', name: 'email' },
        {
            label: 'Рубрика каталога:', kind: 'dropdown', name: 'division',
            variants: [{ text: 'здоровье', value: 1 }, { text: 'домашний уют', value: 2 }, { text: 'бытовая техника', value: 3 }]
        },
        {
            label: 'Размещение:', kind: 'radio', name: 'payment',
            variants: [{ text: 'бесплатное', value: 1 }, { text: 'платное', value: 2 }, { text: 'VIP', value: 3 }]
        },
        { label: 'Разрешить отзывы:', kind: 'check', name: 'votes' },
        { label: 'Описание сайта:', kind: 'memo', name: 'description' },
        { caption: 'Опубликовать', kind: 'submit' },
    ];

const formDef2 =
    [
        { label: 'Фамилия:', kind: 'longtext', name: 'lastname' },
        { label: 'Имя:', kind: 'longtext', name: 'firstname' },
        { label: 'Отчество:', kind: 'longtext', name: 'secondname' },
        { label: 'Возраст:', kind: 'number', name: 'age' },
        { caption: 'Зарегистрироваться', kind: 'submit' },
    ];
    function buildForm(definition, formElem){
        definition.forEach(elem =>{
            const label = document.createElement('label');
            label.textContent = elem.label;
            formElem.appendChild(label);
            switch(elem.kind){
                case 'longtext':
                case 'shorttext':{
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.name = elem.name;
                    formElem.appendChild(input);
                    break;
                }
                case 'number':{
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.name = elem.name;
                    formElem.appendChild(input);
                    break;
                }
                case 'dropdown':{
                    const select = document.createElement('select');
                    select.name = elem.name;
                    elem.variants.forEach(variants =>{
                        const option = document.createElement('option');
                        option.value = variants.value;
                        option.textContent = variants.text;
                        select.appendChild(option);
                    });
                    formElem.appendChild(select);
                    break;
                }
                case 'radio':{
                    elem.variants.forEach(variants =>{
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = elem.name;
                        input.value = variants.value;
                        formElem.appendChild(input);
                        const span = document.createElement('span');
                        span.textContent = variants.text;
                        formElem.appendChild(span);
                    });
                    break;
                }
                case 'check':{
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.name = elem.name;
                    input.checked = 'chekcked'
                    formElem.appendChild(input);
                    break;
                }
                case 'memo':{
                    const textarea = document.createElement('textarea');
                    textarea.name = elem.name;
                    formElem.appendChild(textarea);
                    break;
                }
                case 'submit':{
                    const button = document.createElement('button');
                    button.type = 'submit';
                    button.textContent = elem.caption;
                    formElem.appendChild(button);
                    break;
                }
            }
            const br = document.createElement('br');
            formElem.appendChild(br);
        })
    }
    buildForm(formDef1, document.forms.f1);
    buildForm(formDef2, document.forms.f1);