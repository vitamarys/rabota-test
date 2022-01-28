const link = `./v.json`;
// const link = `https://cors-anywhere.herokuapp.com/https://api.rabota.ua/vacancy/search?keyWords=frontend`;
const root = document.querySelector(".vacancies .conteiner");
let step = 10;
let start = 0;
let cards = [];
const storDesk =  localStorage.getItem('desc');
UPLOADCARE_PUBLIC_KEY = '451663b3e79a2b9fb275';
UPLOADCARE_LOCALE = 'ru';
UPLOADCARE_LOCALE_TRANSLATIONS = {
  buttons: {
    choose: {
      files: {
        one: 'Откликнуться',
        other: 'Upload your documents '
      },
      images: {
        one: 'Upload your photo',
        other: 'Upload your photos'
      }
    }
  }
};


const getData = async (a, b) => {
  const res = await axios.get(link);
  const body = await res.data.documents;
  a = step;
  b = start;
  for (let i = b; i < a; i++) {
    const item = body[i];
    let hot = ''
    if(item.hot == true ){
      hot = 'Горящая'
    }else{
      hot = 'Новая'
    }
    root.insertAdjacentHTML("afterbegin",
      `  <div class="card" data-id="${item.id}">
      <div class="card__baner">
          <img class="card__baner__img" src="${item.designBannerUrl}" alt="">
      </div>
      <div class="card__info">
          <span class="status">${hot}</span>
          <div class="сompany">
              <h2 class="сompany__title">${item.name}</h2>
              <img class="сompany__logo" src="https://company-logo-frankfurt.rabota.ua/cdn-cgi/image/w=250/${item.logo}" alt="">
          </div>
          <div class="salary">
              <p class="salary__money">10 000 — 15 000 ₴</p>
              <p class="salary__comment">Ставка + процент от продаж</p>
          </div>
          <div class='deskr'>
          <span class='company'>${item.companyName}</span>
          <span class='location'>${item.cityName}</span>
          </div>
          <div class="badges">
          <ul class="badges__list">
          
          </ul>
          </div>
          <div class="short-desc">
          <p class="short-desc__text">${item.shortDescription}</p>
          </div>
          <div class="card__footer">
          <div class="butons">
          <input class="resp" 
          type="hidden"
          name="doc"
          role="uploadcare-uploader"
          data-tabs="file"
          
          />
          <img class="like" src="./assets/img/star.png" alt="">
          <img class="dis" src="./assets/img/dis.png" alt="">
          <p class="cv">Отправлено резюме <a href="" class="link"></a></p>
      </div>
              <p class="time">${item.dateTxt}</p>
          </div>
      

      </div>
      <div class="error">
      <p class="error__text">Ёлки-палки, этот файл просто огромный и не помещается в наш сервер</p>
  </div>   
      </div>
            `
    );
    
    
    for(let r = 0; r < item.badges.length;r++){
      document.querySelector('.badges__list').insertAdjacentHTML('beforeend',`
         <li class="badges__list__item">${item.badges[r].name}</li>
       `)
    }
    
    
  }
  document.querySelectorAll('.card').forEach(el=>{
    cards.push(el)
    
   
  })
  
  
 

  ready();

  
};


const pagination = async (a, b)=>{
  a = step;
  b = start;

  const res = await axios.get(link);
  const body = await res.data.documents;
  const pagination =  document.querySelector('.pagination .conteiner .pagination-item');

  for(let f = 1; f < body.length/a + 1; f++){
    pagination.insertAdjacentHTML('beforeend',`
     <span class="page"> ${body.indexOf(body[f])}</span>
     
     `)
  }
    const page = pagination.querySelectorAll('.page');

      page.forEach((el, index)=>{

        console.log();
        if (index == 0){
          el.classList.add('active')
        }
       
        el.addEventListener('click',(e)=>{
          
          const cards = document.querySelectorAll('.card')
          const target =  e.target;
          const number = +target.innerText
          target.classList.add('active');
          for(let i of page){
            if (i === target){
              continue;
            }else{
              i.classList.remove('active')
            }
          }
            
          cards.forEach(el=>{
            el.remove()
          });
          start = step;
          step *=  number;
          if(number === 1 ){
            start =  0;

            step =  10;
          }
          
          getData(step,start );
        })
      }) 
}



const ready = ()=>{
  const cards =  document.querySelectorAll('.card');
  const myStor = window.localStorage;
  const item = {...myStor};
  const link = document.querySelectorAll('.link');
  const cv = document.querySelectorAll('.cv');
  const statusList = document.querySelectorAll('.status');
  console.log(statusList);

  cards.forEach(card =>{
    const widgets = uploadcare.initialize();
    
    const like = card.querySelector('.like');
    const dis  = card.querySelector('.dis'); 
    const status = card.querySelector('.status');
    const defalf = status.innerText;
    const shortDesk = card.querySelector('.short-desc');
    const chekLink =  card.querySelector('.link');   
   
    widgets.forEach((widget, index)=>{
     
     widget.onUploadComplete((fileInfo) => {
      console.log(fileInfo);
     
      if (fileInfo.size >2000000){
        console.log('Err');
        cards[index].classList.add('er');
        setTimeout(()=>{
          cards[index].classList.remove('er');
        },2000)
        

      }else{
        cards[index].classList.add('ch');
        link[index].innerText = fileInfo.name;
        statusList[index].innerText = 'Вы откликнулись' 
        link[index].href = `https://ucarecdn.com/${fileInfo.uuid}/`;
         localStorage.setItem(`${cards[index].dataset.id}id`,`https://ucarecdn.com/${fileInfo.uuid}/`)
         localStorage.setItem(`${cards[index].dataset.id}name`,fileInfo.name)
      }
      
      
    
    });
  })
    like.addEventListener('click',()=>{
      if(like.classList == 'like' && like.src == `${window.location.origin }/assets/img/star.png`){
        like.src="./assets/img/starchec.png";
        dis.src="./assets/img/dis.png";
        card.classList.remove('ds');
        card.classList.add('lk');
        localStorage.removeItem(`${card.dataset.id}`);
        localStorage.setItem(`${card.dataset.id}`, true);
               
      }else{
        like.src="./assets/img/star.png";
        status.style.visibility = 'visible';
        localStorage.removeItem(`${card.dataset.id}`, true)
      }
    })
    dis.addEventListener('click',()=>{
      
      
      if(dis.classList == 'dis' && dis.src == `${window.location.origin }/assets/img/dis.png`){
        card.classList.remove('lk');
        card.classList.add('ds');
        localStorage.removeItem(`${card.dataset.id}`);
        localStorage.setItem(`${card.dataset.id}`, false);
        
        status.innerText = 'Неинтересная'  
        dis.src="./assets/img/discheck.png";
        like.src="./assets/img/star.png";
      }
      else{
        dis.src="./assets/img/dis.png";
        card.classList.remove('ds');
        status.innerText = defalf;
        localStorage.removeItem(`${card.dataset.id}`)
      }
    })
    
    

      for(let key in item ){
      console.log(key);
      console.log(card.dataset.id);
        if(card.dataset.id ==  key ){
            if(myStor[key] == 'true'){
              
              card.classList.add('lk')
            }
            else if(myStor[key] == 'false'){
              card.classList.add('ds')
            }
            
          
        }
        if(key == `${card.dataset.id}id`){
         card.classList.add('ch')
         chekLink.href = localStorage.getItem(key)
         status.innerText = 'Вы откликнулись'
        }
        if(key == `${card.dataset.id}name`){
          card.classList.add('ch')
          chekLink.innerHTML = localStorage.getItem(key)
         }
      }
        
      if(card.classList == 'card lk'){

     
        like.src="./assets/img/starchec.png";
        status.style.display = 'none'       
        
        }
        else if (card.classList == 'card ds'){
          dis.src="./assets/img/discheck.png";
        
          status.innerText = 'Неинтересная'   
             
        }
        
        if(localStorage.getItem('desc') == null || localStorage.getItem('desc') == 'true'){
          shortDesk.classList.add('active')
        } else{
          shortDesk.classList.remove('active')
        } 
   
      })
      
    
   

}
const descrShow =()=>{
  const descrBtns = document.querySelectorAll('.description__item');
  
  descrBtns.forEach(el=>{
    el.classList.remove('active');
    
    if(storDesk == null || storDesk == 'true'){
      descrBtns[1].classList.add('active');
    }else{
      descrBtns[0].classList.add('active');
    }
   
    el.addEventListener('click',(e)=>{
        const target = e.target;
        localStorage.setItem('desc',target.dataset.id);
        target.classList.add('active');
          for(let i of descrBtns){
            if (i === target){
              continue;
            }else{
              i.classList.remove('active')
            }
          }
          cards.forEach(el=>{
    const shortDesk = el.querySelector('.short-desc');
    if(localStorage.getItem('desc') == null || localStorage.getItem('desc') == 'true'){
      shortDesk.classList.add('active')
    } else{
      shortDesk.classList.remove('active')
    } 
  })

    })
  })
}




getData(step,start);
pagination(step,start);
descrShow();

