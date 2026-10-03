async function clearSiteData(url) {
    const origin = new URL(url).origin;

    await browser.browsingData.remove(
        {
            hostnames: [new URL(url).hostname]
        },
        {
            cache: true,
            cookies: true,
            indexedDB: true,
            localStorage: true,
            serviceWorkers: true,
            cacheStorage: true
        }
    );

    alert(`Stockage supprimé pour ${origin}`);
}

const loadData = async function() {
    const url = browser.runtime.getURL("data.json");
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const config = await response.json();
    return config;
}

const list = document.getElementById("list");

const addEventListenerCopy = function(object, textToCopy) {
    object.addEventListener("click", async () => {
        await navigator.clipboard.writeText(textToCopy);

        object.classList.add("copied");

        setTimeout(() => {
            object.classList.remove("copied");
        }, 500);
    });
    return object;
}

const addEventListenerBrowse = function(object, url) {
    object.addEventListener("click", () => {
        window.open(url, "_blank", "noopener,noreferrer");
    });
    return object;
}

const genSection = async function() {
    const section = await loadData();
    const div = document.createElement("div");
    div.id = `section_${section.label}`;
    div.className = "item";
    div.textContent = section.label

    const child = addEventListenerBrowse(document.createElement("div"), section.url);
    child.id = `url_${section.label}`;
    child.className = "item";
    child.textContent = section.url;

    div.append(child);
    let i = 0;

    for (const item of section.ids) {
        const newChild_1 = document.createElement("div");
        newChild_1.id = `section_${section.label}_id_label_${i}`;
        newChild_1.className = "item";
        newChild_1.textContent = item.label;

        const newChild_2 = addEventListenerCopy(document.createElement("div"), item.username);
        newChild_2.id = `section_${section.label}_id_uname_${i}`;
        newChild_2.className = "item";
        newChild_2.textContent = item.username;

        const newChild_3 = addEventListenerCopy(document.createElement("div"), item.password);
        newChild_3.id = `section_${section.label}_id_pwd_${i}`;
        newChild_3.className = "item";
        newChild_3.textContent = item.password;
        div.append(newChild_1);
        newChild_1.append(newChild_2);
        newChild_1.append(newChild_3);
        ++i;
    }

    console.log(div);
    list.appendChild(div);

    const button = document.createElement("button");
    button.textContent = "🗑 Vider le stockage";

    button.addEventListener("click", () => {
        clearSiteData(section.url);
    });

    div.appendChild(button);
};

genSection();
