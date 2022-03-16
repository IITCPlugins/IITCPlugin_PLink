import * as Plugin from "iitcpluginkit";
import { WebLink } from "./WebLinks";


class PLink implements Plugin.Class {

    init() {
        // eslint-disable-next-line unicorn/prefer-module
        require("./styles.css");

        window.addHook("portalDetailsUpdated", () => this.replaceButton());
        window.addHook("portalDetailsLoaded", () => this.replaceButton());
    }

    replaceButton(): void {

        const linkDetails = $("#portaldetails .linkdetails");
        if (typeof android !== "undefined") {

            if (selectedPortal) {
                const portal = window.portals[selectedPortal];
                if (portal) {
                    linkDetails.append(
                        $("<aside>").append(
                            $("<div>").append(
                                $("<a>", {
                                    text: "Scanner",
                                    href: WebLink.scanner(portal)
                                }))));
                }
            }
        } else {
            linkDetails.children().hide();

            linkDetails.append(
                $("<a>", { text: "Share", click: () => this.showLinks(), target: "blank" }))
        }
    }


    showLinks(): void {
        if (!selectedPortal) {
            this.toast("no portal selected");
            return;
        }

        const portal = window.portals[selectedPortal];
        if (!portal) {
            this.toast("no portal data");
            return;
        }

        const ll = portal.getLatLng();

        const html = $("<div>", { class: "portalweblinks" }).append(
            $("<p>").append(
                $("<span>", { text: "Portal", class: "title" }),
                this.createLink("Intel", WebLink.intel(portal)),
                this.createLink("Ingress", WebLink.scanner(portal)),
                this.createLink("Location", `${ll.lat}, ${ll.lng}`, "").on("click", () => this.copy(`${ll.lat}, ${ll.lng}`))
            ),
            $("<p>").append(
                $("<span>", { text: "Map", class: "title" }),
                this.createLink("Google Maps", WebLink.google(portal)),
                this.createLink("OSM", WebLink.osm(portal)),
                this.createLink("Bing Maps", WebLink.bing(portal)),
                $("<div>", { id: "qrcode" })
            )
        );

        const mdia = window.dialog({
            id: "portallink",
            title: portal.options.data.title,
            html,
            position: { my: "right-30 top+20", at: "left top", of: "#sidebar" }
        });

        ($("#qrcode", mdia) as any).qrcode({ text: `GEO:${ll.lat},${ll.lng}` });
    }


    private createLink(name: string, link: string, realLink?: string): JQuery {

        const sLink = link.replace(/^https:\/\//i, "");

        return $("<div>", { class: "alink" }).append(
            $("<span>", { text: name }),
            $("<a>", { href: realLink || link, text: sLink, target: "blank" }),
            $("<button>", { title: "copy", click: () => this.copy(link) })
        )
    }

    private async copy(text: string): Promise<void> {
        this.toast("copied to clipboard");
        $("#dialog-portallink").dialog("close");
        return navigator.clipboard.writeText(text);
    }


    private toast(text: string, duration: number = 1500): void {
        const margin = 100;

        const message = $("<div>", { class: "toast-popup", text });
        $("body").append(message);

        message.css("width", "auto");
        const windowWidth = window.innerWidth;
        let toastWidth = message.innerWidth()! + margin;
        if (toastWidth >= windowWidth) {
            toastWidth = windowWidth - margin;
            $(self).css("width", toastWidth);
        }
        else {
            toastWidth = message.innerWidth()!;
        }

        const left = (windowWidth - toastWidth) / 2;
        const leftInPercentage = left * 100 / windowWidth;
        message.css("left", `${leftInPercentage}%`);
        message.fadeIn(400);

        setTimeout(() => {
            message.fadeOut(600);
            setTimeout(() => message.remove(), 600);
        }, duration);
    }
}

/**
 * use "main" to access you main class from everywhere
 * (same as window.plugin.PLink)
 */
export const main = new PLink();
Plugin.Register(main, "PLink");
