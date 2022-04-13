'use strict';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('link was clicked!');
  console.log(event);


  /*[DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /*[DONE] add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);

  clickedElement.classList.add('active');

  /*[DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /*[DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log('', articleSelector);

  /*[DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log('', targetArticle);

  /*[IN PROGRESS] add class 'active' to the correct article */
  targetArticle.classList.add('active');

}
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors.list';

function generateTitleLinks(customSelector = ''){
  /*[DONE] remove contents of titleList */
  const titleList = document.querySelector (optTitleListSelector);
  document.querySelector(optTitleListSelector).innerHTML ='';
  /*[DONE] for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
    /*[DONE] get the article id */
    const articleId = article.getAttribute('id'); //nie wiem czy dobrze?
    /* find the title element */

    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /*[DONE] create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

function calculateTagsParams(tags){
  const params = {
    min: 999999,
    max: 1
  };

  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times ');
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage*(optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty objects */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      let linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){//czemu tutaj podkreśla?
        /* [NEW] add tag to AllTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  let allTagsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags:*/
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '"><span>' + tag + '  ' + '</span></a></li>';
    console.log('taglinkHTML:', tagLinkHTML);
    allTagsHTML += tagLinkHTML;

  }
  /* [NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;

}

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault('');//po co to się daje?

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');//nie rozumiem tego?

  /* find all tag links with class active */
  const tagActiveLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let tagActiveLink of tagActiveLinks){
    /* remove class active */
    tagActiveLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagsAll = document.querySelectorAll('a [href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for(let tagAll of tagsAll){
    /* add class active */
    tagAll.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagsAll = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let tagAll of tagsAll){
    /* add tagClickHandler as event listener for that link */
    tagAll.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}



function generateAuthors(){

  /*[NEW]*/
  let allAuthors = {};

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for(let article of articles){
    /* find authors wrapper */
    const authorsWrapper = article.querySelector(optArticleAuthorSelector);

    /* make html variable with empty string */
    let html = '';

    /*[NEW*/
    const articleAuthors = article.getAttribute('data-author');
    const articleAuthorsArray = [];
    articleAuthorsArray.push(articleAuthors);
    for(let articleAuthor of articleAuthorsArray){
      let linkHTML = '<li><a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a></li>';

      html = linkHTML;

      if(!allAuthors.hasOwnProperty(articleAuthor)){
        /* [NEW] add generated code to allTags array*/
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
    }

    authorsWrapper.innerHTML = html;

  }

  const authorList = document.querySelector(optAuthorsListSelector);
  let allAuthorsHTML = '';

  for(let articleAuthor in allAuthors){

    const linkHTML = '<li><a class="author-name" href="#author-' + articleAuthor + '" ><span>' + articleAuthor + '</span></a></li>';
    allAuthorsHTML = allAuthorsHTML + linkHTML;

  }
  authorList.innerHTML = allAuthorsHTML;



}

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault('');//po co to się daje?

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');//nie rozumiem tego?

  /* find all author links with class active */
  const authorActiveLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active author link */
  for(let authorActiveLink of authorActiveLinks){
    /* remove class active */
    authorActiveLink.classList.remove('active');
  /* END LOOP: for each active author link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorsAll = document.querySelectorAll('a [href="' + href + '"]');

  /* START LOOP: for each found author link */
  for(let authorAll of authorsAll){
    /* add class active */
    authorAll.classList.add('active');
  /* END LOOP: for each found author link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author ="' + author + '"]');
}

function addClickListenersToAuthors(){
  /* find all links to authors */
  const authorsAll = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  for(let authorAll of authorsAll){
    /* add authorClickHandler as event listener for that link */
    authorAll.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();