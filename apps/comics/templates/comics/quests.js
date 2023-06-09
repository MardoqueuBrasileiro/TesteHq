"use strict";


const QUESTS = function () {
    function createShareLink(template) {
        let uri = encodeURIComponent(window.location.href);
        let message = encodeURIComponent("Visit Swords!");
        return template.replace("{url}", uri).replace("{message}", message);
    }
    function makeTile(url="", image="", title="", cta="", share=false) {
        return `
            <a class="archive-tile" ${ share ? `onclick="QUESTS.share('${ url }')"` : `href="${ url }"` }
               rel="noopener"
               target="blank" style="background-image: url('${ image }')">
              <strong>${ title }</strong>
              <small>${ cta }</small>
            </a>
        `;
    }

    const initializePage = async function () {
        // Fetch the data
        const response = await fetch("/comic/data/");
        const data = await response.json()
        let html;

        // Set up the social share links
        html = "";
        for (let link of data.socialLinks) {
            if (!link.shareUrlTemplate) { continue; }
            html += makeTile(createShareLink(link.shareUrlTemplate), link.image, link.title, link.shareCta, true);
        }
        // TODO: If the device supports navigator.share, make a special tile
        const shareContainer = document.getElementById("social-share-container");
        if (shareContainer !== null) {
            shareContainer.innerHTML = html;
        }

        // Set up the social follow links
        html = "";
        for (let link of data.socialLinks) {
            if (link.followUrl === undefined && link.visitUrl === undefined) { continue; }
            if (link.requiresMoney) { continue; }
            html += makeTile(link.followUrl || link.visitUrl, link.image, link.title, link.followCta);
        }
        const followContainer = document.getElementById("social-follow-container");
        if (followContainer !== null) {
            followContainer.innerHTML = html;
        }

        // Set up the contribution follow links
        html = "";
        for (let link of data.socialLinks) {
            if (link.followUrl === undefined && link.visitUrl === undefined) { continue; }
            if (!link.requiresMoney) { continue; }
            html += makeTile(link.followUrl || link.visitUrl, link.image, link.title, link.followCta);
        }
        const moneyContainer = document.getElementById("social-money-container");
        if (moneyContainer !== null) {
            moneyContainer.innerHTML = html;
        }

    };

    const share = function (url) {
        // TODO: Log this in GA
        const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
        window.open(url, 'sharer', options);
        return true;
    };

    const navigatorShare = function (url, title, message) {
        if (!navigator.share) {
            return false;
        }
        navigator.share({
            url: url,
            text: text,
            title: title,
        });
    };

    // Run the initialization and then publish any variables that need to be public.
    return {
        initializePage: initializePage,
        share: share,
        navigatorShare: navigatorShare,
    };
}();

document.addEventListener("DOMContentLoaded", function(event) {
    QUESTS.initializePage();
});
