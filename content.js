// Load dom-to-image-more-fonts.js from web_accessible_resources
// const loadDomToImage = async () => {
//   const script = document.createElement('script');
//   script.src = chrome.runtime.getURL('libs/dom-to-image-more-fonts.js');
//   document.head.appendChild(script);
//   return new Promise(resolve => {
//     script.onload = resolve;
//   });
// };

(function () {
    "use strict";

    let report_helper = {
        helper_list_name: "",
        hamburger_keypress_state: false,
        captureScreenshot: function (targetElement, copyBtn) {
            // use `style` attribute trick to keep these away from the screenshot, but will be restored once done with screen capture
            let preped_items = [];
            let unwantend_elem = [".W5F8i", ".g4Y3U"]; // remark: ".th6py.io4wk" are the reply buttons each with icons below the email body    // ".T_6Xj" this is the 3 dots `. . .` before the reply / reply all / forward buttons
            unwantend_elem.length > 0 &&
                unwantend_elem.forEach(function (unw_elem, index) {
                    const elem = document.querySelector(unw_elem);
                    elem && elem.setAttribute("style", "display:none");
                });

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            let viva_img_icon =
                document.querySelectorAll(
                    '.ms-OverflowSet-item button[name="Viva Insights"]'
                ) || "";
            viva_img_icon.length &&
                viva_img_icon.forEach(function (email_toolset_item) {
                    let viva_icon = email_toolset_item.querySelector(
                        ".ms-Icon-imageContainer img.ms-Image-image.ms-Image-image--contain.is-loaded"
                    );
                    viva_icon &&
                        viva_icon.setAttribute(
                            "src",
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA3gSURBVHgB7Z1PdhRHEsYjswoG443mBG5OgDiB4QSWF/OeJS8s7f0QfQLECRrh2atZWPDGC8QJ0JwAcQL33EDeiDfQleH8srqbltRSRdbfzBK/BbJFiVZVfBWZGRkRqeiG8dOIB4poXWmzTkp/R8zr9ttrStEa26/nLmaa2O9NSNGpYv7ARp9M7f//MVQn1BMU9ZyNEa/dyQ2+oUj9YO94QNWZ2Ed3zBm9/Uh0fDRUpxQpvRWAfdMfwuhaqV8uvdm1o8Ymo5evh+qYIqN3AsgNz0+tS39I7TNRWu39/qt6SZHQGwF0bPiLRCOE6AWAMf4bbZ4r6+opMOzQc8SZGtqhYUKBErUANn+bbmjWB82P8ZU4ZeJnrx4nzylAohXAzy94ZB/sE4oGN1F8Fpo3iE4AWMfrlN9Y/7pO8TExmXoUkgiiEoAzfsLv7H8OqCpMJ6RsQMd+ZZP9z3oTu5ZPJ18umA7wp9bpfSZzzz6q+zVNMCefs+mPfwxvBxFMikYAlY3PGIvpRBnz8oySozLBGzfhpOwhaTUPKpWde5xaETwKQQRRCKCS8a3h7R/7Z0Y/rzNil0cYsw2t9dOS0cUgRBC8AEobvyHDr+Kn0XS7pBBO7ZzgQZdzguAFsPWbeV9iwnd0lqmdNmP029YjfNLmiZ1XPCU/JvZ3fdDVfkLQAvBe6tm33igzfP04HVNH/DT6/FDr5MDHGzDT8atd/Yg6IFgBbL2Ybts5+IH0esbWrQljieWGLW2XqkruuazQh10Ei4IUgPe4b5dyxqgfQ1pfY0j4v2eI2k4KH7Q9KdQUIHYbd488jH8WyJu/zNiO6a92k21mFm8IpTodUcsEJ4CtEa9L3xq4fbz5ISdk/MPoJy7oJACBpp//za1uaoXnARI7dkpAYCfAN/8i8AQQKdLLJNez4T3EGKglghJAPvGTuX4m9SR048/B72lMtiO8fHAXy8mWCEoAzFro/tT41W48WTfg9fDWsb3BZ6KLldqllghGAP8afVqXbLa4cd9uq1KE3LZRSeFQsIZ4ArVAMAJIdSJze4r3Y3H9F8nnA7KhQOnEN6JYimAEYGf+3xddg7c/1MwaKRgKEPkrug7esI3JYBACQGoXiSZ/ao96AJtMNIR9k5htapgwPIBRG5LL2NB/qQe4CSFRceyC1Q/UMEEIQOL+DdPbWMf+lTDvF11ih4H1poeBzgWAuD8J3L8iJQsQRYIx5lhw2dodmjaa+9i5AFSaiW7wo6G31COkw4BKdM8FYFTxDbI6ibkA8yqYBKsB0vepQToXACtVfINKtpkSH1w8qW04/b37SSAXZ9YymQ/URxRPBNcMqEG6HwIEqVOK9Z/UQ3iaSDxbv1cBJLhBY6Z/0Q1mtlJqhCgEcL5ipz+EENdIqUEW/Xgou2RkQ8kkc8sgpq90R60CmLdlQR2dtlEspnkU67Kj0dbwQSYkNgyekU7pezb2q3tGxeiE/9zcR+DINao6qrMVTeWs4DZ68XzO1IOYO3MhnHs3pV3F/KSmZzRBk6o6ys1LC6DVliysNg53VXSRQDcEarPXbPeSan0HvAXQRUuWroomyjJ/4+2Gzx61RjkheA3D2Lf/1o5Hrffj4Vp6+7UCPOPdhN+3a3zA2yim8U0rFwsAdXo2IPOmi348Nh5euF0cAlu/8dPaGliUY2Anl2P8HtIfKBwCcpfPb7puv3aWqX+GvCG09YIP8BZSKMwqpoqe2bUeIB/L+F0Ivfea3hevQnDGB3aJeVfzu6KEkis9wNz4lXejXKMG13T5dOlD13wqZ2c/NT58rKTFFa1Ri/HzZ3TqGlPPUPlQO6jQhmb+b1/rCa4MBNmJzEFZ4yPrVZE6Mub6NK6t0ScbCNF2qeS6axR8Fm9YUQ5DGgbcWMvljO/zjAzpdZ1o5AeKcifPAU+QGBSd7qz+61Ufmt/YHvlQoSWLtBdASMvBUs8IMD8zRo/LrNvzvgMoG/Pven7Vs1MrP8Qu9cgLNT7LqPTb6dqr5J9Z5O4mh4/1PeoYa3ys8b2EiDeejdqpYwOobIDJZNmjWSragksC2HphYIgBSaixJcvmfjaW3JDSarvLJsxwyZSk731+pinP5ZpTJRruXTpPuPQCnVsFOGVLq3NR42amj+rqx8PGjGXXtVs+vYx785L0nfgH8ILYt66pYev1MB2jy5i09Nwy2NrP9pa/sRCASzpgWUOmeT+ewxrbmUhLpiyDbxNqpW5umXnbGq9AGF6QCy63bvLSc/VILAKldpdfoIUAVGKE5VnI5J020o/HegGRa0fnsLaqZwEemG+Ez5DZOWyp34+zhbWJ8PK15f4DXwRAwpp0O4tt6sbg0qRK1kly0GSq1DKIhJJPeNc+o7Zb1cEmnPFQdPFS/wEnAGlxJlz/4W6yRw3i00kDrdiang+4PRCfSChekIaf0VW8GibPhcPoov9A7gHExZli45TGYy6wHORoBKz1fRpVoiNYV8Zf/A7CymOdpG7F5QRgl1+FVagwStMTmsVnGRfyFcYU1PbWi0zcUFKKd6DHhlzRFo46Rv4CsXvpNfavSTSzVWNqCUxq7Hjm0QbGimDfvK9rTuCGRA/jz9vVUSAIvYAbBrSd/Uvi/adtN2XCeGa/HIl/wA4HmKlXFQECPTiHSHp9SC1q59yhFJN0UeGpHQJEtfmdNGa4ndmhQB7kAC6M7ZMQsYwTT5LKk14C7VWIXkQsaE6JwlMtqc2zF7Wynr3IrMkiumj77TFY942Qtk96VJlzCabG7IRm/AWKi5No7W6vVqJdJe0V+64T94Czqb8I5ulRAiG4QE/qt9ZHfP8/w1Q+RLWNrPB0DauAQdF1XdfmucBTORGAhRCQvDGb9J7jbkIjr9wHDvccwDnTqZkILhso+2AKi1PshsO9EFzdbCcObrpq8AcZSieJUlgyDTzX+vt2uSe+viuk2/pRVWfBE3jufl0FahY3jN3T9zx88igG4/sgEkAW0NGsi90vnyViDWC5h3OIKB4GkosggEnRRbc0fUcBAREcPtY/ipsvV2S+1o+pT5FKM8lLO8EqoPCmWJnO07BWgbg75ic1DAlXEmKgR4Kk+RbuTRvDxf13WuhYWRbnDXb1PZOZnSaE0FTuQ9NImm/ZifBfWtKBq42OlVVBLkHdQmgzqaNu7CT3YeE1io81Z0bUqCjkypxlloUg3lZeRQdJHXUxO3mluPuatb0Wd6xsqX99XUAIOIwRcwRvIXSY1FEHwpNXTmF7nf9AcdwYWTFt5uHVhU7pF5+MnhCSOqrgGneI7le5ZXQuAGFKdmxeYFbAsSf+AbuD9hHHvEWMRkmfBKYvAhAPA1ZZmy+yKB7QLKlDHK+P4QzCImbb4IOi6/Lczrzljl76bmH/eqBIjXDAEwWMi4NHntThi9snkXo788XWCwG4E62Eu223kvRNWynZvngXcDCdxrrWnzNPZJFc68ROehFGXwgAyRdSL0B55s270ERQNqkj1rU+8L7nC6eundsMcrNfjzqz0ETgm9SB5V7QSR0F+Bp/1alrl3YDjV/ufzAicJ06PJM6Il/ueXs7zndRz3FJAC6vXFpilNO5CPLZr7xTB5I6bprxXWRzxTxHXXW9tF5/iYmNurU+ky5TwGFDxQ8oUkoZn+jIbZ+v4MqEEJ9z72e07gk2kezpWcBxtsINxkK5N59OrktkuVIAWBXc9qk7z2lNBDC+MjyWXh9jUscypY1fcM/XpoQt8vIDEwFCvD7GD7WAQ0pTxgeFOYHeHShyGhMByrV9GzTlnTq+Gn8VioTkLcrsL+LXnqy2iWHeGYsPfLuWxtZpfJmmjQ/EaeFdegLM9JOE33u3rI2ggOMq2jA+EHuAc79YS55g1kBStMN1iYgDPW0ZH3gLADQpgjqOV0FSRwjNGsrQpvFBKQGAukQAg98hWp8fpFS1M3kspVuraNv4oLQAQFkR4MAjayiUZw18e95ey1e3700lAYCSIqgXrPPV1wlfGSoLAHQpAkT4kNAR655+l8YHtVQHl1wiVgbj/UejHnw1fnlq8QBz2vIEeev17FlbbeuaIATjg1oFAJoUgetQTmqv7Y5ldROK8UHtAgB1i6APb/yckIwPGhEAqCwC97bzy88mO/oj4qTNZUIzPmhMAKCsCFYdbRI7IRofNCoA0PUuYgiEanzQuADATRZByMYHrQgA3EQRhG580JoAwE0SQQzGB60KANwEEcRifNC6AECfRRCT8UEnAgB9FEFsxgedCQD0SQQxGh90KgDQBxHEanzQuQBAzCKI2fggCAGAGEUQu/FBMAIAMYmgD8YHQQkAxCCCvhgfBCcAELII+mR8EOSJIVXK0JpsYefOFOyR8UGwR8aUFcGtJH1f9tzA63BdR+2/TT0yPghyCFimQmYRhgSc63dMFXC9dzU/9S9MDd/4IHgBgCrpZcgn1Ika//6rPJF0Xq5WyvDuQ+MwPohCAKBqjqG90VNDdKyYP7DRJ5x3RZ3g73AoVmpde5LSd5nhDa1ovWxhakzGB9EIAARRhnYdkRkfRHVuICaGt407NzC8LOEIjQ+iEgBYdC9r+dzA60A/ghiND6IaAi6ytZ/tkVK1L/l8iLkHEYhaAKCreUHedzDbib1+IXoBzNkcZU+UVruNC4Gxeoi71/AyvREAcK3kErOhuAEhzAx/ZvTzmI+VuUivBLDM5mi6QVptKFI/2Lssu6Y/tXOMI5NNX/atVG1ObwWwDI670zq9T4of2rF7bWVvonzPAQY/wZLOmOmHvhp9mb8BPJmJGSRsIWEAAAAASUVORK5CYII="
                        );

                    ////////////////// set below const to true if above base64 img does not work;
                    const solution_if_cannot_do_image_replacement_directly_we_will_hide_restore_strategy = false;
                    if (
                        viva_icon &&
                        solution_if_cannot_do_image_replacement_directly_we_will_hide_restore_strategy
                    ) {
                        email_toolset_item.setAttribute(
                            "style",
                            "display:none"
                        );
                        preped_items.push(email_toolset_item);
                        if (email_toolset_item.previousSibling.nodeType === 1) {
                            email_toolset_item.previousSibling.setAttribute(
                                "style",
                                "display:none"
                            );
                            preped_items.push(
                                email_toolset_item.previousSibling
                            );
                        }
                    }
                });

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // additional prep work before doing screenshot, if clicked - "Just Email Body"
            if (
                targetElement.firstElementChild.getAttribute("class") ===
                "aVla3"
            ) {
                // set some padding around the element before the screenshot
                let all_child_elem_in_container = targetElement.childNodes;
                // Loop through each child node
                for (let i = 0; i < all_child_elem_in_container.length; i++) {
                    // Check if the node is an element node
                    // value 1 represents an element node
                    if (
                        all_child_elem_in_container[i].nodeType === 1 &&
                        all_child_elem_in_container[i].className != "W5F8i"
                    ) {
                        all_child_elem_in_container[i].setAttribute(
                            "style",
                            "padding:0 3px;"
                        );

                        if (i === 0) {
                            all_child_elem_in_container[i].setAttribute(
                                "style",
                                "padding-top:3px;padding-left:3px;padding-right:3px;"
                            );
                        }
                        if (i === all_child_elem_in_container.length - 2) {
                            // index-2 because last element is a height placeholder that we are ignoring
                            all_child_elem_in_container[i].setAttribute(
                                "style",
                                "padding-bottom:3px;padding-left:3px;padding-right:3px;margin-bottom:3px;"
                            );
                        }

                        preped_items.push(all_child_elem_in_container[i]);
                    }
                }
                targetElement.setAttribute("style", "height: 100%;");
                preped_items.push(targetElement);
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // if clicked - "The Email (Full)"
            const emailBodyHeight = document.querySelector(".NiD4s");
            emailBodyHeight.style.height = "auto";

            let is_trigger_for_email_full = targetElement.parentNode;
            if (is_trigger_for_email_full.className.indexOf("NiD4s") !== -1) {
                targetElement.setAttribute("style", "padding-left:8px;");
                preped_items.push(targetElement);
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //.MoreHorizontalRegular f14t3ns0 fne0op0 fg4l7m0 fmd4ok8 f1sxfq9t
            // Q0K3G ___198tor0 f14t3ns0 fne0op0 fg4l7m0 fmd4ok8 f1sxfq9t
            (function () {
                // do a direct replacement of the icon with our own copy of elem that uses a base64 src
                const replaceElemWithBase64Src = (
                    icon_name,
                    datasrc,
                    item,
                    i_elem
                ) => {
                    const do_action = (elem) => {
                        if (elem && elem != "solo") {
                            let elemStyles = window.getComputedStyle(elem);

                            let img = new Image();
                            img.src = datasrc;
                            img.classList.add("done_replacement");
                            img.classList.add("remove_this_elem_replacer"); // remove_this_elem_replacer
                            item.querySelector("span").appendChild(img);
                            // Apply computed styles
                            for (let styleName in elemStyles) {
                                if (
                                    elemStyles.hasOwnProperty(styleName) &&
                                    typeof styleName === "string" &&
                                    isNaN(parseInt(styleName, 10))
                                ) {
                                    // Filter out invalid properties and numeric indices
                                    img.style.setProperty(
                                        styleName,
                                        elemStyles.getPropertyValue(styleName)
                                    );
                                }
                            }
                            img.style.display = "display:inline-block"; // make sure its visible
                            img.style.fill = "currentColor !important";
                            img.style.fontWeight = "400";
                            img.style.height = "100%";
                            img.style.width = "100%";
                            img.style.verticalAlign = "top";

                            if (
                                icon_name === "busy" ||
                                icon_name === "away" ||
                                icon_name === "be right back" ||
                                icon_name === "offline" ||
                                icon_name === "available" ||
                                icon_name === "do not disturb"
                            ) {
                                img.style.width = "13.2px";
                                img.style.height = "13.2px";
                                // img.style.width = "14px";
                                // img.style.height = "14px";
                            }

                            elem.setAttribute("style", "display:none");
                            preped_items.push(elem);
                        } else {
                            let elemStyles = window.getComputedStyle(item);

                            let img = new Image();
                            img.src = datasrc;
                            img.classList.add("done_replacement");
                            img.classList.add("remove_this_elem_replacer"); // remove_this_elem_replacer
                            item.insertAdjacentElement("afterend", img);
                            // Apply computed styles
                            for (let styleName in elemStyles) {
                                if (
                                    elemStyles.hasOwnProperty(styleName) &&
                                    typeof styleName === "string" &&
                                    isNaN(parseInt(styleName, 10))
                                ) {
                                    // Filter out invalid properties and numeric indices
                                    img.style.setProperty(
                                        styleName,
                                        elemStyles.getPropertyValue(styleName)
                                    );
                                }
                            }
                            img.style.display = "display:inline-block"; // make sure its visible
                            img.style.fill = "currentColor !important";
                            img.style.fontWeight = "400";
                            img.style.width = "16px";
                            img.style.height = "auto";
                            if (
                                icon_name === "WeatherSunnyRegular" ||
                                icon_name === "Reactions" ||
                                icon_name === "AppFolderRegular" ||
                                icon_name === "ArrowReplyRegular" ||
                                icon_name === "ArrowReplyAllRegular" ||
                                icon_name === "ArrowForwardRegular" ||
                                icon_name === "MoreHorizontalRegular"
                            ) {
                                img.style.height = "auto";
                                img.style.width = "20.5px";
                            }
                            if (icon_name === "FlagOutline_Solo") {
                                img.style.position = "relative !important";
                                img.style.marginTop = "-5px";
                            }
                            if (icon_name === "AttachRegular_Solo") {
                                img.style.height = "auto";
                            }
                            if (icon_name === "DoorArrowLeft") {
                                img.style.height = "auto";
                                img.style.width = "20px";
                                img.style.position = "relative";
                                img.style.marginRight = "20px";
                            }
                            img.style.verticalAlign = "top";
                            item.setAttribute("style", "display:none");
                            preped_items.push(elem);
                        }
                    };

                    do_action(i_elem);
                };

                // Office UI Fabric Icons
                // https://www.flicon.io/ (can download in SVG)
                // https://uifabricicons.azurewebsites.net/ (can view but cannot download SVG)

                /////////////////////////////////////////////////////////////////////////////////////////////////

                // https://fluenticons.co/ -> find the icons you need from the helpful site.
                // or direct from Microsoft GitHub if icon does not look right,
                // https://github.com/microsoft/fluentui-system-icons/blob/main/icons_filled.md,
                // https://github.com/microsoft/fluentui-system-icons/blob/main/icons_regular.md, right click open icon on new tab
                //
                // These are the icons which we need to manually do a src=base64 replacement, the later function won't be affected as we are checking if replacments have been done or not.
                const icoElems = [
                    {
                        iconName: "FlagFilled",
                        icoElemSelector: 'i[data-icon-name="FlagFilled"]',
                        theIconTagToReplace: "i.Q0K3G.___1hzgx0x",
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M8.75 6C8.05964 6 7.5 6.55964 7.5 7.25V42.75C7.5 43.4404 8.05964 44 8.75 44C9.44036 44 10 43.4404 10 42.75V33H41.25C41.7212 33 42.1524 32.735 42.3653 32.3145C42.5781 31.8941 42.5364 31.3897 42.2574 31.0099L33.8011 19.5L42.2574 7.9901C42.5364 7.61033 42.5781 7.10592 42.3653 6.68547C42.1524 6.26502 41.7212 6 41.25 6H8.75Z' fill='%23ee6666'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "FlagOutline_Solo",
                        icoElemSelector: 'i[aria-label="Flag for follow up."]', // plus need to change the icon selector
                        theIconTagToReplace: "solo", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg width='24' height='24' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3.747a.75.75 0 0 1 .75-.75h16.504a.75.75 0 0 1 .6 1.2L16.69 9.748l4.164 5.552a.75.75 0 0 1-.6 1.2H4.5v4.749a.75.75 0 0 1-.648.743L3.75 22a.75.75 0 0 1-.743-.648L3 21.249V3.747Zm15.754.75H4.5V15h14.254l-3.602-4.802a.75.75 0 0 1 0-.9l3.602-4.8Z' fill='%23b94d52'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "InfoRegular",
                        icoElemSelector: 'i[data-icon-name="InfoRegular"]',
                        theIconTagToReplace: "i.Q0K3G.___1hzgx0x",
                        datasrc:
                            "data:image/svg+xml,%3Csvg width='24' height='24' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm0 1.5a8.502 8.502 0 1 0 0 17.003A8.502 8.502 0 0 0 12 3.5Zm-.004 7a.75.75 0 0 1 .744.648l.007.102.003 5.502a.75.75 0 0 1-1.493.102l-.007-.101-.003-5.502a.75.75 0 0 1 .75-.75ZM12 7.003a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997Z' fill='%23858585'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ClassificationRegular",
                        icoElemSelector:
                            'i[data-icon-name="ClassificationRegular"]',
                        theIconTagToReplace: "i.Q0K3G.___1hzgx0x",
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23858585' d='M18.944 8.288c1.175-1.603 2.574-3.462 3.228-4.116a4 4 0 1 1 5.656 5.657c-.653.653-2.513 2.052-4.115 3.227-.685.503-1.344.98-1.88 1.364l2.897 2.896a4.5 4.5 0 0 1 .002 6.362l-3.17 3.175a1.5 1.5 0 0 1-2.123 0l-.878-.878-2.289 2.293a2.5 2.5 0 0 1-3.537.002l-9.003-9.002a2.5 2.5 0 0 1 0-3.536l2.293-2.292-.879-.88a1.5 1.5 0 0 1 0-2.12l3.172-3.172a4.5 4.5 0 0 1 6.364 0l2.898 2.898c.385-.535.861-1.194 1.364-1.878ZM7.438 14.854l-2.293 2.292a.5.5 0 0 0 0 .708l9.003 9.002a.5.5 0 0 0 .708 0l2.29-2.295-9.708-9.707Zm15.09-3.41c1.666-1.221 3.367-2.512 3.885-3.03a2 2 0 0 0-2.828-2.828c-.518.518-1.808 2.22-3.03 3.884-.584.797-1.134 1.56-1.542 2.13l1.386 1.386c.571-.408 1.333-.958 2.13-1.542ZM6.915 11.5 20.5 25.085l2.817-2.82a2.5 2.5 0 0 0-.001-3.535L13.268 8.682a2.5 2.5 0 0 0-3.536 0L6.914 11.5Z'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ClassificationRegular", // alternative selector
                        icoElemSelector:
                            'i[data-icon-name="ClassificationRegular"]',
                        theIconTagToReplace: "i.fui-Icon-font.Q0K3G.___16s2kb5", //'i.Q0K3G.___1hzgx0x',
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 32 32'%3E%3Cpath fill='%23858585' d='M18.944 8.288c1.175-1.603 2.574-3.462 3.228-4.116a4 4 0 1 1 5.656 5.657c-.653.653-2.513 2.052-4.115 3.227-.685.503-1.344.98-1.88 1.364l2.897 2.896a4.5 4.5 0 0 1 .002 6.362l-3.17 3.175a1.5 1.5 0 0 1-2.123 0l-.878-.878-2.289 2.293a2.5 2.5 0 0 1-3.537.002l-9.003-9.002a2.5 2.5 0 0 1 0-3.536l2.293-2.292-.879-.88a1.5 1.5 0 0 1 0-2.12l3.172-3.172a4.5 4.5 0 0 1 6.364 0l2.898 2.898c.385-.535.861-1.194 1.364-1.878ZM7.438 14.854l-2.293 2.292a.5.5 0 0 0 0 .708l9.003 9.002a.5.5 0 0 0 .708 0l2.29-2.295-9.708-9.707Zm15.09-3.41c1.666-1.221 3.367-2.512 3.885-3.03a2 2 0 0 0-2.828-2.828c-.518.518-1.808 2.22-3.03 3.884-.584.797-1.134 1.56-1.542 2.13l1.386 1.386c.571-.408 1.333-.958 2.13-1.542ZM6.915 11.5 20.5 25.085l2.817-2.82a2.5 2.5 0 0 0-.001-3.535L13.268 8.682a2.5 2.5 0 0 0-3.536 0L6.914 11.5Z'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "AttachRegular",
                        icoElemSelector: 'i[data-icon-name="AttachRegular"]',
                        theIconTagToReplace: "i.Q0K3G.___1hzgx0x",
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Cpath d='M16.223 4.36391C19.3749 1.21199 24.4852 1.21199 27.6371 4.3639C30.7891 7.51587 30.789 12.6263 27.6369 15.7781L14.8471 28.5673C12.9378 30.4765 9.84222 30.4765 7.93293 28.5672C6.0236 26.6578 6.0236 23.5622 7.93293 21.6529L19.2929 10.2929C19.6834 9.9024 20.3166 9.9024 20.7071 10.2929C21.0976 10.6834 21.0976 11.3166 20.7071 11.7071L9.34714 23.0671C8.21886 24.1954 8.21886 26.0247 9.34714 27.153C10.4754 28.2812 12.3047 28.2812 13.4329 27.153L26.2228 14.3639C28.5937 11.993 28.5938 8.14902 26.2229 5.77812C23.852 3.40725 20.0081 3.40725 17.6372 5.77812L3.70711 19.7082C3.31658 20.0988 2.68342 20.0988 2.29289 19.7082C1.90237 19.3177 1.90237 18.6845 2.29289 18.294L16.223 4.36391Z' fill='%23858585'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "AttachRegular_Solo",
                        icoElemSelector: 'i[aria-label="Has attachments"]', // plus need to change the icon selector
                        theIconTagToReplace: "solo", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Cpath d='M16.223 4.36391C19.3749 1.21199 24.4852 1.21199 27.6371 4.3639C30.7891 7.51587 30.789 12.6263 27.6369 15.7781L14.8471 28.5673C12.9378 30.4765 9.84222 30.4765 7.93293 28.5672C6.0236 26.6578 6.0236 23.5622 7.93293 21.6529L19.2929 10.2929C19.6834 9.9024 20.3166 9.9024 20.7071 10.2929C21.0976 10.6834 21.0976 11.3166 20.7071 11.7071L9.34714 23.0671C8.21886 24.1954 8.21886 26.0247 9.34714 27.153C10.4754 28.2812 12.3047 28.2812 13.4329 27.153L26.2228 14.3639C28.5937 11.993 28.5938 8.14902 26.2229 5.77812C23.852 3.40725 20.0081 3.40725 17.6372 5.77812L3.70711 19.7082C3.31658 20.0988 2.68342 20.0988 2.29289 19.7082C1.90237 19.3177 1.90237 18.6845 2.29289 18.294L16.223 4.36391Z' fill='%23858585'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ImportantFilled",
                        icoElemSelector: 'i[data-icon-name="ImportantFilled"]', // plus need to change the icon selector
                        theIconTagToReplace: "i.Q0K3G.___16s2kb5", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Cpath d='M10 8C10 4.68629 12.6863 2 16 2C19.3137 2 22 4.68629 22 8C22 11.5231 20.0141 16.5356 18.8408 19.1895C18.3452 20.3105 17.2257 21 16 21C14.7743 21 13.6548 20.3105 13.1592 19.1895C11.9859 16.5356 10 11.5231 10 8ZM16 30C17.933 30 19.5 28.433 19.5 26.5C19.5 24.567 17.933 23 16 23C14.067 23 12.5 24.567 12.5 26.5C12.5 28.433 14.067 30 16 30Z' fill='%23ee6666'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ChevronUpRegular",
                        icoElemSelector: 'i[data-icon-name="ChevronUpRegular"]',
                        theIconTagToReplace: "i.Q0K3G.___1hzgx0x",
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M39.6339 31.8839C39.1457 32.372 38.3543 32.372 37.8661 31.8839L24 18.0178L10.1339 31.8839C9.64573 32.372 8.85427 32.372 8.36612 31.8839C7.87796 31.3957 7.87796 30.6043 8.36612 30.1161L23.1161 15.3661C23.6043 14.878 24.3957 14.878 24.8839 15.3661L39.6339 30.1161C40.122 30.6043 40.122 31.3957 39.6339 31.8839Z' fill='%23ffffff'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ChevronDownRegular",
                        icoElemSelector:
                            'i[data-icon-name="ChevronDownRegular"]',
                        theIconTagToReplace: "i.Q0K3G.___1hzgx0x",
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M8.36612 16.1161C7.87796 16.6043 7.87796 17.3957 8.36612 17.8839L23.1161 32.6339C23.6043 33.122 24.3957 33.122 24.8839 32.6339L39.6339 17.8839C40.122 17.3957 40.122 16.6043 39.6339 16.1161C39.1457 15.628 38.3543 15.628 37.8661 16.1161L24 29.9822L10.1339 16.1161C9.64573 15.628 8.85427 15.628 8.36612 16.1161Z' fill='%23ffffff'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "DoorArrowLeft",
                        icoElemSelector: "i.TzOzf.___zolrug0", // plus need to change the icon selector
                        theIconTagToReplace: "solo", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6.25 2C5.00736 2 4 3.00736 4 4.25V19.75C4 20.9926 5.00736 22 6.25 22H12.8096C12.3832 21.5557 12.0194 21.051 11.7322 20.5H6.25C5.83579 20.5 5.5 20.1642 5.5 19.75V4.25C5.5 3.83579 5.83579 3.5 6.25 3.5H17.75C18.1642 3.5 18.5 3.83579 18.5 4.25V11.0764C19.0232 11.1572 19.5258 11.3004 20 11.4982V4.25C20 3.00736 18.9926 2 17.75 2H6.25ZM17.5 23C20.5376 23 23 20.5376 23 17.5C23 14.4624 20.5376 12 17.5 12C14.4624 12 12 14.4624 12 17.5C12 20.5376 14.4624 23 17.5 23ZM21 17.5C21 17.7761 20.7761 18 20.5 18H15.7071L17.3536 19.6464C17.5488 19.8417 17.5488 20.1583 17.3536 20.3536C17.1583 20.5488 16.8417 20.5488 16.6464 20.3536L14.1464 17.8536C13.9512 17.6583 13.9512 17.3417 14.1464 17.1464L16.6464 14.6464C16.8417 14.4512 17.1583 14.4512 17.3536 14.6464C17.5488 14.8417 17.5488 15.1583 17.3536 15.3536L15.7071 17H20.5C20.7761 17 21 17.2239 21 17.5ZM8.5 13.25C9.32843 13.25 10 12.5784 10 11.75C10 10.9216 9.32843 10.25 8.5 10.25C7.67157 10.25 7 10.9216 7 11.75C7 12.5784 7.67157 13.25 8.5 13.25Z' fill='%23ffffff'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "Delete",
                        icoElemSelector: "i.ETblR.___1hzgx0x",
                        theIconTagToReplace: "solo", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M20 10.5V11H28V10.5C28 8.29086 26.2091 6.5 24 6.5C21.7909 6.5 20 8.29086 20 10.5ZM17.5 11V10.5C17.5 6.91015 20.4101 4 24 4C27.5899 4 30.5 6.91015 30.5 10.5V11H41.75C42.4404 11 43 11.5596 43 12.25C43 12.9404 42.4404 13.5 41.75 13.5H38.8325L36.8329 37.3556C36.518 41.1117 33.3775 44 29.6082 44H18.3923C14.623 44 11.4825 41.1118 11.1676 37.3557L9.16749 13.5H6.25C5.55964 13.5 5 12.9404 5 12.25C5 11.5596 5.55964 11 6.25 11H17.5ZM13.6589 37.1469C13.8652 39.6077 15.9228 41.5 18.3923 41.5H29.6082C32.0777 41.5 34.1353 39.6077 34.3416 37.1468L36.3238 13.5H11.6763L13.6589 37.1469ZM21.5 20.25C21.5 19.5596 20.9404 19 20.25 19C19.5596 19 19 19.5596 19 20.25V34.75C19 35.4404 19.5596 36 20.25 36C20.9404 36 21.5 35.4404 21.5 34.75V20.25ZM27.75 19C28.4404 19 29 19.5596 29 20.25V34.75C29 35.4404 28.4404 36 27.75 36C27.0596 36 26.5 35.4404 26.5 34.75V20.25C26.5 19.5596 27.0596 19 27.75 19Z' fill='%23479EF5'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ChevronUpRegular",
                        icoElemSelector:
                            'button[title="Expand header"] span.fui-Button__icon i.___1hzgx0x',
                        theIconTagToReplace: "solo", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M39.6339 31.8839C39.1457 32.372 38.3543 32.372 37.8661 31.8839L24 18.0178L10.1339 31.8839C9.64573 32.372 8.85427 32.372 8.36612 31.8839C7.87796 31.3957 7.87796 30.6043 8.36612 30.1161L23.1161 15.3661C23.6043 14.878 24.3957 14.878 24.8839 15.3661L39.6339 30.1161C40.122 30.6043 40.122 31.3957 39.6339 31.8839Z' fill='%23ffffff'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "WeatherSunnyRegular",
                        icoElemSelector:
                            'i[data-icon-name="WeatherSunnyRegular"]',
                        theIconTagToReplace: "i.Q0K3G.___16s2kb5",
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2048 2048'%3E%3Cpath d='M960 512q93 0 174 35t143 96 96 142 35 175q0 93-35 174t-96 143-142 96-175 35q-93 0-174-35t-143-96-96-142-35-175q0-93 35-174t96-143 142-96 175-35zm0 768q66 0 124-25t101-68 69-102 26-125q0-66-25-124t-69-101-102-69-124-26q-66 0-124 25t-102 69-69 102-25 124q0 66 25 124t68 102 102 69 125 25zm64-896H896V0h128v384zM896 1536h128v384H896v-384zm1024-640v128h-384V896h384zM384 1024H0V896h384v128zm123-426L236 326l90-90 272 271-91 91zm906 724l271 272-90 90-272-271 91-91zm0-724l-91-91 272-271 90 90-271 272zm-906 724l91 91-272 271-90-90 271-272z' fill='%2362ABF5'%3E%3C/path%3E%3C/svg%3E",
                    },
                    {
                        iconName: "Reactions",
                        icoElemSelector: 'button[aria-label="Reactions"]',
                        theIconTagToReplace: "i.fui-Icon-regular.___51sje20", // formerly when it worked => i.Q0K3G.___1hzgx0x
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M17.5 22C18.8807 22 20 20.8807 20 19.5C20 18.1193 18.8807 17 17.5 17C16.1193 17 15 18.1193 15 19.5C15 20.8807 16.1193 22 17.5 22ZM33 19.5C33 20.8807 31.8807 22 30.5 22C29.1193 22 28 20.8807 28 19.5C28 18.1193 29.1193 17 30.5 17C31.8807 17 33 18.1193 33 19.5ZM18.4519 34.6812C20.1644 35.5709 22.07 36.0239 23.9996 36C25.9292 36.0239 27.8349 35.5709 29.5473 34.6812C31.2597 33.7915 32.7259 32.4926 33.8156 30.9C33.9889 30.6177 34.043 30.2781 33.9659 29.9559C33.8888 29.6337 33.6869 29.3553 33.4046 29.182C33.1223 29.0087 32.7827 28.9546 32.4605 29.0317C32.1383 29.1088 31.8599 29.3107 31.6866 29.593C30.8212 30.8219 29.6683 31.8203 28.3284 32.5013C26.9885 33.1823 25.5024 33.5252 23.9996 33.5C22.4969 33.5246 21.011 33.1815 19.6712 32.5005C18.3315 31.8196 17.1784 30.8214 16.3126 29.593C16.2268 29.4532 16.1143 29.3317 15.9815 29.2354C15.8487 29.1391 15.6983 29.0699 15.5387 29.0317C15.3792 28.9935 15.2137 28.9872 15.0517 29.0129C14.8897 29.0387 14.7344 29.0962 14.5946 29.182C14.4548 29.2678 14.3333 29.3803 14.237 29.5131C14.1407 29.6459 14.0715 29.7963 14.0333 29.9559C13.9951 30.1154 13.9888 30.2809 14.0146 30.4429C14.0403 30.6049 14.0978 30.7602 14.1836 30.9C15.2733 32.4926 16.7395 33.7915 18.4519 34.6812ZM24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4ZM6.5 24C6.5 14.335 14.335 6.5 24 6.5C33.665 6.5 41.5 14.335 41.5 24C41.5 33.665 33.665 41.5 24 41.5C14.335 41.5 6.5 33.665 6.5 24Z' fill='%23479EF5'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "Reactions", // including an alternate selector due to search filter action
                        icoElemSelector:
                            ".ms-OverflowSet-item .fui-FluentProvider.___5n94it0 button",
                        theIconTagToReplace:
                            "i.fui-Icon-font.fui-Icon-regular.___51sje20", // formerly when it worked => i.Q0K3G.___1hzgx0x
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M17.5 22C18.8807 22 20 20.8807 20 19.5C20 18.1193 18.8807 17 17.5 17C16.1193 17 15 18.1193 15 19.5C15 20.8807 16.1193 22 17.5 22ZM33 19.5C33 20.8807 31.8807 22 30.5 22C29.1193 22 28 20.8807 28 19.5C28 18.1193 29.1193 17 30.5 17C31.8807 17 33 18.1193 33 19.5ZM18.4519 34.6812C20.1644 35.5709 22.07 36.0239 23.9996 36C25.9292 36.0239 27.8349 35.5709 29.5473 34.6812C31.2597 33.7915 32.7259 32.4926 33.8156 30.9C33.9889 30.6177 34.043 30.2781 33.9659 29.9559C33.8888 29.6337 33.6869 29.3553 33.4046 29.182C33.1223 29.0087 32.7827 28.9546 32.4605 29.0317C32.1383 29.1088 31.8599 29.3107 31.6866 29.593C30.8212 30.8219 29.6683 31.8203 28.3284 32.5013C26.9885 33.1823 25.5024 33.5252 23.9996 33.5C22.4969 33.5246 21.011 33.1815 19.6712 32.5005C18.3315 31.8196 17.1784 30.8214 16.3126 29.593C16.2268 29.4532 16.1143 29.3317 15.9815 29.2354C15.8487 29.1391 15.6983 29.0699 15.5387 29.0317C15.3792 28.9935 15.2137 28.9872 15.0517 29.0129C14.8897 29.0387 14.7344 29.0962 14.5946 29.182C14.4548 29.2678 14.3333 29.3803 14.237 29.5131C14.1407 29.6459 14.0715 29.7963 14.0333 29.9559C13.9951 30.1154 13.9888 30.2809 14.0146 30.4429C14.0403 30.6049 14.0978 30.7602 14.1836 30.9C15.2733 32.4926 16.7395 33.7915 18.4519 34.6812ZM24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4ZM6.5 24C6.5 14.335 14.335 6.5 24 6.5C33.665 6.5 41.5 14.335 41.5 24C41.5 33.665 33.665 41.5 24 41.5C14.335 41.5 6.5 33.665 6.5 24Z' fill='%23479EF5'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "AppFolderRegular",
                        icoElemSelector: 'i[data-icon-name="AppFolderRegular"]',
                        theIconTagToReplace: "solo", // formerly when it worked => i.Q0K3G.___1hzgx0x
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M12 15.5C12 13.567 13.567 12 15.5 12H19.5C21.433 12 23 13.567 23 15.5V19.5C23 21.433 21.433 23 19.5 23H15.5C13.567 23 12 21.433 12 19.5V15.5ZM15.5 14.5C14.9477 14.5 14.5 14.9477 14.5 15.5V19.5C14.5 20.0523 14.9477 20.5 15.5 20.5H19.5C20.0523 20.5 20.5 20.0523 20.5 19.5V15.5C20.5 14.9477 20.0523 14.5 19.5 14.5H15.5ZM15.5 25C13.567 25 12 26.567 12 28.5V32.5C12 34.433 13.567 36 15.5 36H19.5C21.433 36 23 34.433 23 32.5V28.5C23 26.567 21.433 25 19.5 25H15.5ZM14.5 28.5C14.5 27.9477 14.9477 27.5 15.5 27.5H19.5C20.0523 27.5 20.5 27.9477 20.5 28.5V32.5C20.5 33.0523 20.0523 33.5 19.5 33.5H15.5C14.9477 33.5 14.5 33.0523 14.5 32.5V28.5ZM25 15.5C25 13.567 26.567 12 28.5 12H32.5C34.433 12 36 13.567 36 15.5V19.5C36 21.433 34.433 23 32.5 23H28.5C26.567 23 25 21.433 25 19.5V15.5ZM28.5 14.5C27.9477 14.5 27.5 14.9477 27.5 15.5V19.5C27.5 20.0523 27.9477 20.5 28.5 20.5H32.5C33.0523 20.5 33.5 20.0523 33.5 19.5V15.5C33.5 14.9477 33.0523 14.5 32.5 14.5H28.5ZM28.5 25C26.567 25 25 26.567 25 28.5V32.5C25 34.433 26.567 36 28.5 36H32.5C34.433 36 36 34.433 36 32.5V28.5C36 26.567 34.433 25 32.5 25H28.5ZM27.5 28.5C27.5 27.9477 27.9477 27.5 28.5 27.5H32.5C33.0523 27.5 33.5 27.9477 33.5 28.5V32.5C33.5 33.0523 33.0523 33.5 32.5 33.5H28.5C27.9477 33.5 27.5 33.0523 27.5 32.5V28.5ZM6 12.25C6 8.79822 8.79822 6 12.25 6H35.75C39.2018 6 42 8.79822 42 12.25V35.75C42 39.2018 39.2018 42 35.75 42H12.25C8.79822 42 6 39.2018 6 35.75V12.25ZM12.25 8.5C10.1789 8.5 8.5 10.1789 8.5 12.25V35.75C8.5 37.8211 10.1789 39.5 12.25 39.5H35.75C37.8211 39.5 39.5 37.8211 39.5 35.75V12.25C39.5 10.1789 37.8211 8.5 35.75 8.5H12.25Z' fill='%23479EF5'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ArrowReplyRegular",
                        icoElemSelector:
                            'i[data-icon-name="ArrowReplyRegular"]',
                        theIconTagToReplace: "solo", // formerly when it worked => i.Q0K3G.___1hzgx0x
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M17.1339 10.1339C17.622 9.64573 17.622 8.85427 17.1339 8.36612C16.6457 7.87796 15.8543 7.87796 15.3661 8.36612L4.36612 19.3661C3.87796 19.8543 3.87796 20.6457 4.36612 21.1339L15.3661 32.1339C15.8543 32.622 16.6457 32.622 17.1339 32.1339C17.622 31.6457 17.622 30.8543 17.1339 30.3661L8.26777 21.5H25.25C34.2246 21.5 41.5 28.7754 41.5 37.75C41.5 38.4404 42.0596 39 42.75 39C43.4404 39 44 38.4404 44 37.75C44 27.3947 35.6053 19 25.25 19H8.26777L17.1339 10.1339Z' fill='%23b65fc2'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ArrowReplyAllRegular",
                        icoElemSelector:
                            'i[data-icon-name="ArrowReplyAllRegular"]',
                        theIconTagToReplace: "solo", // formerly when it worked => i.Q0K3G.___1hzgx0x
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M17.1339 8.36612C17.622 8.85427 17.622 9.64573 17.1339 10.1339L7.01777 20.25L17.1339 30.3661C17.622 30.8543 17.622 31.6457 17.1339 32.1339C16.6457 32.622 15.8543 32.622 15.3661 32.1339L4.36612 21.1339C3.87796 20.6457 3.87796 19.8543 4.36612 19.3661L15.3661 8.36612C15.8543 7.87796 16.6457 7.87796 17.1339 8.36612ZM25.1339 8.36612C25.622 8.85427 25.622 9.64573 25.1339 10.1339L16.2678 19H25.25C35.6053 19 44 27.3947 44 37.75C44 38.4404 43.4404 39 42.75 39C42.0596 39 41.5 38.4404 41.5 37.75C41.5 28.7754 34.2246 21.5 25.25 21.5H16.2678L25.1339 30.3661C25.622 30.8543 25.622 31.6457 25.1339 32.1339C24.6457 32.622 23.8543 32.622 23.3661 32.1339L12.3661 21.1339C11.878 20.6457 11.878 19.8543 12.3661 19.3661L23.3661 8.36612C23.8543 7.87796 24.6457 7.87796 25.1339 8.36612Z' fill='%23b65fc2'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ArrowForwardRegular",
                        icoElemSelector:
                            'i[data-icon-name="ArrowForwardRegular"]',
                        theIconTagToReplace: "solo", // formerly when it worked => i.Q0K3G.___1hzgx0x
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M34.985 22.5005L27.9237 29.5614C27.4356 30.0496 27.4356 30.841 27.9237 31.3292C28.3793 31.7848 29.0992 31.8152 29.59 31.4203L29.6915 31.3292L38.8839 22.1368C39.3395 21.6812 39.3699 20.9614 38.975 20.4705L38.8839 20.3691L29.6915 11.1767C29.2033 10.6885 28.4119 10.6885 27.9237 11.1767C27.4681 11.6323 27.4377 12.3521 27.8326 12.8429L27.9237 12.9444L34.981 20.0005H26C22.7463 20.0005 19.7205 20.7211 17.0964 22.0994L16.6854 22.3225C14.0032 23.8263 11.8258 26.0038 10.3219 28.6859C8.79842 31.4032 8 34.5756 8 38.0005C8 38.6909 8.55964 39.2505 9.25 39.2505C9.94036 39.2505 10.5 38.6909 10.5 38.0005C10.5 34.9964 11.1923 32.2454 12.5026 29.9086C13.7813 27.6278 15.6273 25.7819 17.908 24.5031C20.1151 23.2657 22.6914 22.5794 25.5017 22.5069L26 22.5005H34.985Z' fill='%2362abf5'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ImportantFilled",
                        icoElemSelector: 'i[data-icon-name="ImportantFilled"]',
                        theIconTagToReplace: "i.Q0K3G.___1hzgx0x",
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Cpath d='M10 8C10 4.68629 12.6863 2 16 2C19.3137 2 22 4.68629 22 8C22 11.5231 20.0141 16.5356 18.8408 19.1895C18.3452 20.3105 17.2257 21 16 21C14.7743 21 13.6548 20.3105 13.1592 19.1895C11.9859 16.5356 10 11.5231 10 8ZM16 30C17.933 30 19.5 28.433 19.5 26.5C19.5 24.567 17.933 23 16 23C14.067 23 12.5 24.567 12.5 26.5C12.5 28.433 14.067 30 16 30Z' fill='%23ee6666'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "MoreHorizontalRegular",
                        icoElemSelector:
                            'i[data-icon-name="MoreHorizontalRegular"]',
                        theIconTagToReplace: "solo", // formerly when it worked => i.Q0K3G.___1hzgx0x
                        datasrc:
                            "data:image/svg+xml,%3Csvg width='24' height='24' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.75 12a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0ZM13.75 12a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0ZM18 13.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z' fill='%23fff'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "DoubleChevronDown",
                        icoElemSelector:
                            'i[data-icon-name="DoubleChevronDown"]',
                        theIconTagToReplace: "solo", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2048 2048'%3E%3Cpath fill='%23fff' d='M2048 91 1024 1115 0 91 91 0l933 933L1957 0l91 91zM1024 1829l933-933 91 91-1024 1024L0 987l91-91 933 933z'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "ChevronDownMed",
                        icoElemSelector: 'i[data-icon-name="ChevronDownMed"]',
                        theIconTagToReplace: "solo", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2048 2048'%3E%3Cpath d='M1024 1657L25 658l121-121 878 878 878-878 121 121-999 999z' fill='%23d6d6d6'%3E%3C/path%3E%3C/svg%3E",
                    },
                    {
                        iconName: "Download",
                        icoElemSelector: 'i[data-icon-name="Download"]',
                        theIconTagToReplace: "solo", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2048 2048'%3E%3Cpath d='M384 2048v-128h1152v128H384zm1197-979l-621 626-621-626 90-90 467 470V0h128v1449l467-470 90 90z' fill='%23d6d6d6'%3E%3C/path%3E%3C/svg%3E",
                    },
                    {
                        iconName: "Cloud",
                        icoElemSelector: 'i[data-icon-name="Cloud"]',
                        theIconTagToReplace: "solo", // add here as `solo` mean na da inner elements ...
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2048 2048'%3E%3Cpath d='M1661 896q80 0 150 30t123 81 83 122 31 151q0 80-30 149t-82 122-123 83-149 30H512q-106 0-199-40t-163-109-110-163-40-200q0-106 40-199t109-163 163-110 200-40q46 0 93 9 40-62 92-111t115-84 132-52 144-18q111 0 209 39t175 107 125 163 64 203zm3 640q53 0 99-20t82-55 55-81 20-100q0-53-20-99t-55-82-81-55-100-20h-128v-64q0-93-35-174t-96-143-142-96-175-35q-70 0-135 21t-119 59-97 91-67 120q-75-35-158-35-80 0-149 30t-122 82-83 123-30 149q0 80 30 149t82 122 122 83 150 30h1152z' fill='%23d6d6d6'%3E%3C/path%3E%3C/svg%3E",
                    },
                    {
                        iconName: "busy",
                        icoElemSelector: '[aria-label="busy"]',
                        theIconTagToReplace:
                            ".fui-Icon-font.___n379xf0.f14t3ns0.fne0op0.fkc42ay.fmd4ok8.f9dzkbp",
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23D13438' d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z'/%3E%3C/svg%3E",
                    },
                    // {
                    //     "iconName": "unknown",
                    //     "icoElemSelector": '[aria-label="unknown"]',
                    //     "theIconTagToReplace": '.fui-Icon-font.___1ggnnpz',
                    //     "datasrc": "data:image/svg+xml,%3Csvg width='24' height='24' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z' fill='%23fff'/%3E%3C/svg%3E"
                    // },
                    {
                        iconName: "busy",
                        icoElemSelector: '[aria-label="busy"]', // alternative busy selector (due to search filter action)
                        theIconTagToReplace: ".fui-Icon-font.___sgs9b70",
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23D13438' d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z'/%3E%3C/svg%3E",
                    },
                    {
                        //.fui-Icon-font.___sgs9b70.f14t3ns0.fne0op0.fg4l7m0.fmd4ok8.f303qgw.f9dzkbp  // the full string
                        iconName: "away",
                        icoElemSelector: '[aria-label="away"]',
                        theIconTagToReplace: "solo", // formerly when it worked => .fui-Icon-font.___n379xf0.f14t3ns0.fne0op0.fkc42ay.fmd4ok8.f9dzkbp
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23eaa300' d='M12 0c1.1 0 2.16.14 3.19.42s1.98.69 2.86 1.22c.88.53 1.69 1.16 2.43 1.88.73.72 1.36 1.53 1.89 2.43.52.9.93 1.86 1.21 2.87s.43 2.08.43 3.19c0 1.1-.14 2.16-.42 3.19s-.69 1.98-1.22 2.86-1.16 1.69-1.88 2.43-1.53 1.36-2.43 1.89-1.86.93-2.87 1.21-2.08.43-3.19.43c-1.1 0-2.16-.14-3.19-.42s-1.98-.69-2.86-1.22a13.38 13.38 0 0 1-2.43-1.88 11.82 11.82 0 0 1-1.89-2.43c-.52-.9-.93-1.86-1.21-2.87s-.43-2.08-.43-3.19c0-1.1.14-2.16.42-3.19s.69-1.98 1.22-2.86c.53-.88 1.16-1.69 1.88-2.43.72-.73 1.53-1.36 2.43-1.89.9-.52 1.86-.93 2.87-1.21S10.89 0 12 0Zm3.76 17.03c.17 0 .33-.03.48-.09s.29-.16.41-.28.21-.26.27-.4.09-.3.11-.49c0-.35-.12-.65-.38-.9l-3.39-3.39V5.34c0-.17-.03-.34-.09-.49s-.15-.29-.27-.4-.25-.2-.41-.27-.32-.11-.49-.11-.34.03-.49.09-.28.15-.4.27-.21.25-.27.41-.1.32-.11.49V12c0 .16.03.32.09.48s.15.3.27.42l3.76 3.75c.25.25.55.38.9.38Z'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "be right back",
                        icoElemSelector: '[aria-label="be right back"]',
                        theIconTagToReplace: "solo", // formerly when it worked => .fui-Icon-font.___n379xf0.f14t3ns0.fne0op0.fkc42ay.fmd4ok8.f9dzkbp
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23eaa300' d='M12 0c1.1 0 2.16.14 3.19.42s1.98.69 2.86 1.22c.88.53 1.69 1.16 2.43 1.88.73.72 1.36 1.53 1.89 2.43.52.9.93 1.86 1.21 2.87s.43 2.08.43 3.19c0 1.1-.14 2.16-.42 3.19s-.69 1.98-1.22 2.86-1.16 1.69-1.88 2.43-1.53 1.36-2.43 1.89-1.86.93-2.87 1.21-2.08.43-3.19.43c-1.1 0-2.16-.14-3.19-.42s-1.98-.69-2.86-1.22a13.38 13.38 0 0 1-2.43-1.88 11.82 11.82 0 0 1-1.89-2.43c-.52-.9-.93-1.86-1.21-2.87s-.43-2.08-.43-3.19c0-1.1.14-2.16.42-3.19s.69-1.98 1.22-2.86c.53-.88 1.16-1.69 1.88-2.43.72-.73 1.53-1.36 2.43-1.89.9-.52 1.86-.93 2.87-1.21S10.89 0 12 0Zm3.76 17.03c.17 0 .33-.03.48-.09s.29-.16.41-.28.21-.26.27-.4.09-.3.11-.49c0-.35-.12-.65-.38-.9l-3.39-3.39V5.34c0-.17-.03-.34-.09-.49s-.15-.29-.27-.4-.25-.2-.41-.27-.32-.11-.49-.11-.34.03-.49.09-.28.15-.4.27-.21.25-.27.41-.1.32-.11.49V12c0 .16.03.32.09.48s.15.3.27.42l3.76 3.75c.25.25.55.38.9.38Z'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "offline",
                        icoElemSelector: '[aria-label="offline"]',
                        theIconTagToReplace: "solo", // formerly when it worked => .fui-Icon-font.___1ldh2fi.f14t3ns0.fne0op0.fkc42ay.fmd4ok8.f1krtbx5
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23adadad' d='M16.05 7.95c.57.58.57 1.52 0 2.1L14.13 12l1.95 1.95a1.5 1.5 0 0 1-2.13 2.1L12 14.13l-1.95 1.95a1.5 1.5 0 0 1-2.1-2.13L9.87 12l-1.95-1.95a1.5 1.5 0 0 1 2.13-2.1L12 9.87l1.95-1.95c.58-.57 1.52-.57 2.1 0v.03ZM0 12C0 5.37 5.37 0 12 0s12 5.37 12 12-5.37 12-12 12S0 18.63 0 12Zm12-9a9 9 0 1 0 .001 18.001A9 9 0 0 0 12 3Z'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "available",
                        icoElemSelector: '[aria-label="available"]',
                        theIconTagToReplace: "solo", // formerly when it worked => .fui-Icon-font.___n379xf0.f14t3ns0.fne0op0.fkc42ay.fmd4ok8.f9dzkbp
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%233DB838' d='M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm3.22 6.97-4.47 4.47-1.97-1.97a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5-5a.75.75 0 1 0-1.06-1.06Z'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "available", // alternative busy selector (due to search filter action)
                        icoElemSelector: '[aria-label="available"]',
                        theIconTagToReplace: ".fui-Icon-font.___sgs9b70", // formerly when it worked => .fui-Icon-font.___n379xf0.f14t3ns0.fne0op0.fkc42ay.fmd4ok8.f9dzkbp
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%233DB838' d='M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm3.22 6.97-4.47 4.47-1.97-1.97a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5-5a.75.75 0 1 0-1.06-1.06Z'/%3E%3C/svg%3E",
                    },
                    {
                        iconName: "do not disturb",
                        icoElemSelector: '[aria-label="do not disturb"]',
                        theIconTagToReplace: "solo", // formerly when it worked => .fui-Icon-font.___n379xf0.f14t3ns0.fne0op0.fkc42ay.fmd4ok8.f9dzkbp
                        datasrc:
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23d13438' d='M12 0c1.1 0 2.16.14 3.19.42s1.98.69 2.86 1.22c.88.53 1.69 1.16 2.43 1.88.73.72 1.36 1.53 1.89 2.43.52.9.93 1.86 1.21 2.87s.43 2.08.43 3.19c0 1.1-.14 2.16-.42 3.19s-.69 1.98-1.22 2.86-1.16 1.69-1.88 2.43-1.53 1.36-2.43 1.89-1.86.93-2.87 1.21-2.08.43-3.19.43c-1.1 0-2.16-.14-3.19-.42s-1.98-.69-2.86-1.22a13.38 13.38 0 0 1-2.43-1.88 11.82 11.82 0 0 1-1.89-2.43c-.52-.9-.93-1.86-1.21-2.87s-.43-2.08-.43-3.19c0-1.1.14-2.16.42-3.19s.69-1.98 1.22-2.86c.53-.88 1.16-1.69 1.88-2.43.72-.73 1.53-1.36 2.43-1.89.9-.52 1.86-.93 2.87-1.21S10.89 0 12 0Zm3.79 13.27c.17 0 .34-.03.49-.09s.29-.15.4-.27.2-.25.27-.4.11-.32.11-.5c0-.17-.03-.34-.09-.49s-.15-.29-.27-.4-.25-.2-.41-.27-.32-.11-.49-.11H8.23c-.18 0-.34.03-.49.09s-.28.15-.4.27-.21.25-.27.41-.1.32-.11.49c0 .18.03.34.09.49s.15.28.27.4.25.21.4.27.32.1.5.11h7.57Z'/%3E%3C/svg%3E",
                    },
                ];

                icoElems.map((elements) => {
                    const the_data_icon =
                        document.querySelectorAll(elements.icoElemSelector) ||
                        (() => {
                            console.log(
                                `[Outlook Helper Log] No icon found: ${elements.icoElemSelector}`
                            );
                            return false;
                        })();
                    if (the_data_icon && the_data_icon.length) {
                        the_data_icon.forEach((icon_wrapper) => {
                            if (elements.theIconTagToReplace != "solo") {
                                const i_elem =
                                    icon_wrapper.querySelector(
                                        elements.theIconTagToReplace
                                    ) ||
                                    (() => {
                                        console.log(
                                            `[Outlook Helper Log] Missing the tag to find: ${elements.theIconTagToReplace}`
                                        );
                                        return false;
                                    })();
                                if (icon_wrapper && i_elem) {
                                    replaceElemWithBase64Src(
                                        elements.iconName,
                                        elements.datasrc,
                                        icon_wrapper,
                                        i_elem
                                    );
                                } else {
                                    console.log(
                                        `[Outlook Helper Log] No i tag found: ${elements.theIconTagToReplace}`
                                    );
                                }
                            } else {
                                replaceElemWithBase64Src(
                                    elements.iconName,
                                    elements.datasrc,
                                    icon_wrapper,
                                    "solo"
                                );
                            }
                        });
                    }
                });

                // function abandoned encountering CORS issue with Chrome
                const convertImageToImageWithDataSrcEnabled = function (item) {
                    // Create a canvas element
                    let canvas = document.createElement("canvas");
                    let context = canvas.getContext("2d");

                    // Set canvas size to match image size
                    canvas.width = item.width;
                    canvas.height = item.height;

                    // Draw the image onto the canvas
                    context.drawImage(item, 0, 0);

                    // Append the canvas to the document body or any other element
                    item.parentNode.replaceChild(canvas, item);
                };

                // These are icons we use back its appearance that have loaded back again to convert to an img tag as substitute, if not working best use the former method.
                // Get the font icon element
                // const iconElement1 = document.querySelectorAll('.Jj1JU .ms-OverflowSet-item .ms-Button-flexContainer [data-icon-name="Sunny"]') || (() => { console.log(`[Outlook Helper Log] No selector found: .Jj1JU .ms-OverflowSet-item .ms-Button-flexContainer [data-icon-name="Sunny"]`); return false; })();
                // const iconElement2 = document.querySelectorAll('.Jj1JU .ms-OverflowSet-item .ms-Button-flexContainer .ms-Button-icon i') || (() => { console.log(`[Outlook Helper Log] No selector found: .Jj1JU .ms-OverflowSet-item .ms-Button-flexContainer .ms-Button-icon i`); return false; })();
                // const iconElement3 = document.querySelectorAll('.Jj1JU .ms-Button-flexContainer .ms-Button-menuIcon .FLwLv i') || (() => { console.log(`[Outlook Helper Log] No selector found: .Jj1JU .ms-Button-flexContainer .ms-Button-menuIcon .FLwLv i`); return false; })(); // MoreHorizontalRegular icon `...`
                // const iconElement4 = document.querySelectorAll('.th6py.io4wk .FLwLv i') || (() => { console.log(`[Outlook Helper Log] No selector found: .th6py.io4wk .FLwLv i`); return false; })();
                // const iconElement5 = document.querySelectorAll('.th6py.PtVAk .FLwLv i') || (() => { console.log(`[Outlook Helper Log] No selector found: .th6py.PtVAk .FLwLv i`); return false; })();
                // const iconElement6 = document.querySelectorAll('.D3zfd.XxeQL .BOmmB .FLwLv i') || (() => { console.log(`[Outlook Helper Log] No selector found: .D3zfd.XxeQL .BOmmB .FLwLv i`); return false; })();
                // const iconElement7 = document.querySelectorAll('.GbZTc.XxeQL .BOmmB .FLwLv i') || (() => { console.log(`[Outlook Helper Log] No selector found: .GbZTc.XxeQL .BOmmB .FLwLv i`); return false; })();
                // const iconElement8 = document.querySelectorAll('.RrjjU.disableTextSelection button.ms-Button--icon i.ms-Button-icon') || (() => { console.log(`[Outlook Helper Log] No selector found: .RrjjU.disableTextSelection button.ms-Button--icon i.ms-Button-icon`); return false; })(); // ChevronDownMed
                // const iconElement9 = document.querySelectorAll('.ms-Button-icon.HdWmP') || (() => { console.log(`[Outlook Helper Log] No selector found: .ms-Button-icon.HdWmP`); return false; })();
                // const iconElement10 = document.querySelectorAll('.ms-Button-icon.i6XlR') || (() => { console.log(`[Outlook Helper Log] No selector found: .ms-Button-icon.i6XlR`); return false; })();
                // const iconElement11 = document.querySelectorAll('i.Q0K3G.___198tor0') || (() => { console.log(`[Outlook Helper Log] No selector found: i.Q0K3G.___198tor0`); return false; })();
                // const iconElement11A = document.querySelectorAll('i.Q0K3G.___1hzgx0x') || (() => { console.log(`[Outlook Helper Log] No selector found: i.Q0K3G.___1hzgx0x`); return false; })();
                // const iconElement12 = document.querySelectorAll('._EBjL') || (() => { console.log(`[Outlook Helper Log] No selector found: ._EBjL`); return false; })();
                // const iconElement13 = document.querySelectorAll('.aVla3 .WWy1F.PCN7W i.r6xix1i') || (() => { console.log(`[Outlook Helper Log] No selector found: .aVla3 .WWy1F.PCN7W i.r6xix1i`); return false; })();
                // const iconElement14 = document.querySelectorAll('.infoBarDivClass i.ekTsS') || (() => { console.log(`[Outlook Helper Log] No selector found: .infoBarDivClass i.ekTsS`); return false; })();
                // const iconElement15 = document.querySelectorAll('.ms-Button-icon.igADf') || (() => { console.log(`[Outlook Helper Log] No selector found: .ms-Button-icon.igADf`); return false; })();
                // const iconElement16 = document.querySelectorAll('.ExRIs i.S46JX') || (() => { console.log(`[Outlook Helper Log] No selector found: .ExRIs i.S46JX`); return false; })();


                // function abandoned encountering CORS issue with Chrome
                // const imgElements  = document.querySelectorAll('.ms-Image-image.ms-Image-image--contain');
                // Array.from(imgElements).forEach( item => {
                //     convertImageToImageWithDataSrcEnabled(item);
                // })
            })();

            function filter(node) {
                // Regular expression to match class1 or class2
                const classRegex =
                    /\b(asdvbsdgfndfgdfsc|W5F8i|ug93r|T_6Xj|gfc_5)\b/;

                // Check if the regular expression matches any of the node's classes
                return !classRegex.test(node.className);
            }

            //console.log("captureScreenshot copyBtn",copyBtn);

            // fix the thread spacing derailing downwards before the screencapture
            let threads_spacing = document.querySelectorAll("._nzWz");
            threads_spacing.forEach((thread_box) => {
                // thread_box.style.paddingTop = "0";
                // thread_box.style.position = "relative";
                // thread_box.style.top = "-19px";
                thread_box.style.position = "static";
                thread_box.style.display = "block";
                thread_box.style.width = "inherit";
                thread_box.style.overflow = "hidden";
                thread_box.style.textOverflow = "ellipsis";
                thread_box.style.whiteSpace = "nowrap";
                preped_items.push(thread_box);
            });

            let threads_spacing_inner = document.querySelectorAll(".NNlvm");
            threads_spacing_inner.forEach((thread_box_inner) => {
                thread_box_inner.style.float = "right";
                thread_box_inner.style.marginLeft = "60px";
                preped_items.push(thread_box_inner);
            });

            // Use DOM to Image to capture the element
            domtoimage
                .toBlob(targetElement, {
                    skipFonts: true,
                    filter: filter,
                    copyDefaultStyles: true,
                    bgcolor: "#141414",
                })
                .then(function (blob) {
                    // Create a File object from the blob
                    let file = new File([blob], "image.png", {
                        type: "image/png",
                    });

                    // Create a ClipboardItem object from the File object
                    let clipboardItem = new ClipboardItem({
                        "image/png": file,
                    });

                    copyBtn.classList.remove("copied", "copy-failed");

                    setTimeout(() => {
                        // Write the ClipboardItem object to the clipboard
                        navigator.clipboard
                            .write([clipboardItem])
                            .then(function () {
                                console.log("Image saved to clipboard");
                                copyBtn.innerHTML = "Done!";
                                copyBtn.classList.toggle("copied");
                                setTimeout(function () {
                                    copyBtn.innerHTML =
                                        copyBtn.dataset.ssButtonName;
                                    copyBtn.classList.toggle("copied");
                                    unwantend_elem.forEach(function (
                                        unw_elem,
                                        index
                                    ) {
                                        const elem =
                                            document.querySelector(unw_elem);
                                        elem && elem.removeAttribute("style");
                                        // when doing screenshot with the email title, remove afterwards
                                        emailBodyHeight.style.height = "100%";
                                    });
                                    if (!preped_items.length) {
                                        const myPromise = new Promise(
                                            (resolve, reject) => {
                                                if (success) {
                                                    preped_items.forEach(
                                                        function (item) {
                                                            item.removeAttribute(
                                                                "style"
                                                            );
                                                        }
                                                    );
                                                    const replacer_to_remove =
                                                        document.querySelectorAll(
                                                            ".remove_this_elem_replacer"
                                                        );
                                                    replacer_to_remove &&
                                                        replacer_to_remove.forEach(
                                                            (item) => {
                                                                item.remove();
                                                            }
                                                        );
                                                    console.log("Reset done");
                                                    resolve("Items removed.");
                                                } else {
                                                    reject(
                                                        new Error(
                                                            "Item removel failed!"
                                                        )
                                                    );
                                                }
                                            }
                                        );

                                        myPromise
                                            .then((result) =>
                                                console.log(result)
                                            ) // Handle fulfillment
                                            .catch((error) =>
                                                console.log(error)
                                            ); // Handle rejection
                                    }
                                }, 2000);
                            })
                            .catch(function (error) {
                                let errorKey, errorValue;
                                Object.entries(error).forEach(
                                    ([key, value]) => {
                                        errorKey = key;
                                        errorValue = value;
                                    }
                                );
                                console.error(
                                    "Failed to SAVE TO CLIPBOARD:",
                                    error
                                );
                                copyBtn.innerHTML = `Failed to SAVE TO CLIPBOARD`;
                                copyBtn.classList.toggle("copy-failed");
                                setTimeout(function () {
                                    copyBtn.innerHTML = "Screenshot Email Body";
                                    copyBtn.classList.toggle("copy-failed");
                                }, 10000);
                            });
                    }, 1000);
                })
                .catch(function (error) {
                    let errorKey, errorValue;
                    Object.entries(error).forEach(([key, value]) => {
                        errorKey = key;
                        errorValue = value;
                    });
                    console.error("Failed to CAPTURE image:", error);
                    copyBtn.innerHTML = `Failed to CAPTURE image`;
                    copyBtn.classList.toggle("copy-failed");
                    setTimeout(function () {
                        copyBtn.innerHTML = "Screenshot Email Body";
                        copyBtn.classList.toggle("copy-failed");
                    }, 10000);
                });
        },
        copy_to_clipboard: function (text, btn_obj) {
            // https://www.nikouusitalo.com/blog/why-isnt-clipboard-write-copying-my-richtext-html/
            const clipboard_item = new ClipboardItem({
                "text/plain": new Blob([text.innerText || text.value], {
                    type: "text/plain",
                }),
                "text/html": new Blob([text.outerHTML || text.value], {
                    type: "text/html",
                }),
            });
            navigator.clipboard
                .write([clipboard_item])
                .then(function () {
                    let btn_init_text = btn_obj.innerHTML;

                    btn_obj.innerHTML = "Copied";
                    btn_obj.classList.toggle("copied");

                    setTimeout(function () {
                        btn_obj.innerHTML = btn_init_text;
                        btn_obj.classList.toggle("copied");
                    }, 1500);
                })
                .catch(function (error) {
                    btn_obj.innerHTML = `Copy Error: ${error}`;
                });
        },
        create_helper_menu_element: function (
            helper_list_name,
            top,
            right,
            scale
        ) {
            this.helper_list_name = helper_list_name;
            const inner_menu_body = () => {
                // can be anything, unordered list, table, grid based divs
                let helper_list = document.createElement("div");
                helper_list.classList.add(helper_list_name);
                let ul = document.createElement("ul");
                // let li = document.createElement("li");
                // ul.appendChild(li);
                helper_list.appendChild(ul);

                return helper_list.outerHTML;
            };
            const drawer_menu_layout_html = () => {
                let main_html_layout = document.createElement("div");
                main_html_layout.innerHTML = `<div id="hamburger" class="hamburger-anchor is-open">
                  <div class="burger-icon">
                    <div class="burger-container">
                      <span class="burger-bun-top"></span>
                      <span class="burger-filling"></span>
                      <span class="burger-bun-bot"></span>
                    </div>
                  </div>

                  <div class="burger-ring">
                    <svg class="svg-ring">
                      <path class="path" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="4" d="M 34 2 C 16.3 2 2 16.3 2 34 s 14.3 32 32 32 s 32 -14.3 32 -32 S 51.7 2 34 2" />
                    </svg>
                  </div>

                  <svg width="0" height="0">
                    <mask id="mask">
                      <path xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ff0000" stroke-miterlimit="10" stroke-width="4" d="M 34 2 c 11.6 0 21.8 6.2 27.4 15.5 c 2.9 4.8 5 16.5 -9.4 16.5 h -4" />
                    </mask>
                  </svg>
                  <div class="path-burger">
                    <div class="animate-path">
                      <div class="path-rotation"></div>
                    </div>
                  </div>

                </div>`;
                main_html_layout.innerHTML += inner_menu_body();

                document.body.appendChild(main_html_layout);
            };
            const drawer_menu_layout_style = () => {
                let main_layout_style = document.createElement("div");
                main_layout_style.classList.add("drawer-styles");
                main_layout_style.innerHTML = `<style>
                    :root {
                        --helper_top: ${top};
                        --helper_right: ${right};
                        --helper_scale: scale(${scale});
                    }
                    .hamburger-anchor {
                            position: fixed;
                            top: var(--helper_top);
                            right: var(--helper_right);
                            transform: var(--helper_scale);
                            margin: 40px auto;
                            display: block;
                            width: 68px;
                            height: 68px;
                            background: #fff;
                            -webkit-touch-callout: none;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            border: solid 3px black;
                            border-radius: 5px;
                            box-sizing: content-box;
                            cursor: pointer;
                            z-index: 9999;
                            transition: all 0.2s ease;
                        }
                    .hamburger-anchor:hover {
                            border: solid 3px #fff;
                            transition: all 0.2s ease;
                    }
                    .hamburger-anchor:hover .burger-icon {
                            outline: solid 4px #000;
                            border-radius: 5px;
                            transition: all 0.4s ease;
                    }
                    .hamburger-anchor.is-open .path {
                            -webkit-animation: dash-in 0.6s linear normal;
                            animation: dash-in 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor.is-open .animate-path {
                            -webkit-animation: rotate-in 0.6s linear normal;
                            animation: rotate-in 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor.is-open .burger-bun-top {
                            -webkit-animation: bun-top-out 0.6s linear normal;
                            animation: bun-top-out 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor.is-open .burger-bun-bot {
                            -webkit-animation: bun-bot-out 0.6s linear normal;
                            animation: bun-bot-out 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor.is-open .burger-filling {
                            -webkit-animation: burger-fill-out 0.6s linear normal;
                            animation: burger-fill-out 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor.is-closed .path {
                            -webkit-animation: dash-out 0.6s linear normal;
                            animation: dash-out 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor.is-closed .animate-path {
                            -webkit-animation: rotate-out 0.6s linear normal;
                            animation: rotate-out 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor.is-closed .burger-bun-top {
                            -webkit-animation: bun-top-in 0.6s linear normal;
                            animation: bun-top-in 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor.is-closed .burger-bun-bot {
                            -webkit-animation: bun-bot-in 0.6s linear normal;
                            animation: bun-bot-in 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor.is-closed .burger-filling {
                            -webkit-animation: burger-fill-in 0.6s linear normal;
                            animation: burger-fill-in 0.6s linear normal;
                            -webkit-animation-fill-mode: forwards;
                            animation-fill-mode: forwards;
                        }
                    .hamburger-anchor .path-burger {
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 68px;
                            width: 68px;
                            -webkit-mask: url(#mask);
                            mask: url(#mask);
                            -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='0' height='0'%3E%3Cmask id='mask'%3E%3Cpath xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23ff0000' stroke-miterlimit='10' stroke-width='4' d='M 34 2 c 11.6 0 21.8 6.2 27.4 15.5 c 2.9 4.8 5 16.5 -9.4 16.5 h -4' /%3E%3C/mask%3E%3C/svg%3E");
                        }
                    .hamburger-anchor .path-burger .animate-path {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 68px;
                            height: 68px;
                        }
                    .hamburger-anchor .path-burger .animate-path .path-rotation {
                            height: 34px;
                            width: 34px;
                            margin: 34px 34px 0 0;
                            transform: rotate(0deg);
                            transform-origin: 100% 0;
                        }
                    .hamburger-anchor .path-burger .animate-path .path-rotation:before {
                            content: "";
                            display: block;
                            width: 30px;
                            height: 34px;
                            margin: 0 4px 0 0;
                            background: #000;
                        }

                    @-webkit-keyframes rotate-out {
                            0% {
                                transform: rotate(0deg);
                        }
                            40% {
                                transform: rotate(180deg);
                        }
                            100% {
                                transform: rotate(360deg);
                        }
                        }

                    @keyframes rotate-out {
                            0% {
                                transform: rotate(0deg);
                        }
                            40% {
                                transform: rotate(180deg);
                        }
                            100% {
                                transform: rotate(360deg);
                        }
                        }
                    @-webkit-keyframes rotate-in {
                            0% {
                            transform: rotate(360deg);
                    }
                        40% {
                            transform: rotate(180deg);
                    }
                        100% {
                            transform: rotate(0deg);
                    }
                    }
                    @keyframes rotate-in {
                            0% {
                            transform: rotate(360deg);
                    }
                        40% {
                            transform: rotate(180deg);
                    }
                        100% {
                            transform: rotate(0deg);
                    }
                    }
                    @-webkit-keyframes dash-in {
                            0% {
                            stroke-dashoffset: 240;
                    }
                        40% {
                            stroke-dashoffset: 240;
                    }
                        100% {
                            stroke-dashoffset: 0;
                    }
                    }
                    @keyframes dash-in {
                            0% {
                            stroke-dashoffset: 240;
                    }
                        40% {
                            stroke-dashoffset: 240;
                    }
                        100% {
                            stroke-dashoffset: 0;
                    }
                    }
                    @-webkit-keyframes dash-out {
                            0% {
                                stroke-dashoffset: 0;
                        }
                            40% {
                                stroke-dashoffset: 240;
                        }
                            100% {
                                stroke-dashoffset: 240;
                        }
                        }
                    @keyframes dash-out {
                            0% {
                                stroke-dashoffset: 0;
                        }
                            40% {
                                stroke-dashoffset: 240;
                        }
                            100% {
                                stroke-dashoffset: 240;
                        }
                        }
                    .burger-icon {
                            position: absolute;
                            padding: 20px 16px;
                            outline: solid 4px #fff;
                            outline-offset: 3px;
                            border-radius: 2px;
                            transition: all 0.4s ease;
                        }

                    .burger-container {
                            position: relative;
                            height: 28px;
                            width: 36px;
                        }
                    .burger-container .burger-bun-top,
                    .burger-container .burger-bun-bot,
                    .burger-container .burger-filling {
                            position: absolute;
                            display: block;
                            height: 4px;
                            width: 36px;
                            border-radius: 2px;
                            background: #000;
                        }
                    .burger-container .burger-bun-top {
                            top: 0;
                            transform-origin: 34px 2px;
                        }
                    .burger-container .burger-bun-bot {
                            bottom: 0;
                            transform-origin: 34px 2px;
                        }
                    .burger-container .burger-filling {
                            top: 12px;
                        }

                    .burger-ring {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 68px;
                            height: 68px;
                        }
                    .burger-ring .svg-ring {
                            width: 68px;
                            height: 68px;
                        }
                    .burger-ring .svg-ring .path {
                            stroke-dasharray: 240;
                            stroke-dashoffset: 240;
                            stroke-linejoin: round;
                        }

                    @-webkit-keyframes bun-top-out {
                            0% {
                                left: 0;
                                top: 0;
                                transform: rotate(0deg);
                        }
                            20% {
                                left: 0;
                                top: 0;
                                transform: rotate(15deg);
                        }
                            80% {
                                left: -5px;
                                top: 0;
                                transform: rotate(-60deg);
                        }
                            100% {
                                left: -5px;
                                top: 1px;
                                transform: rotate(-45deg);
                        }
                        }

                    @keyframes bun-top-out {
                            0% {
                                left: 0;
                                top: 0;
                                transform: rotate(0deg);
                        }
                            20% {
                                left: 0;
                                top: 0;
                                transform: rotate(15deg);
                        }
                            80% {
                                left: -5px;
                                top: 0;
                                transform: rotate(-60deg);
                        }
                            100% {
                                left: -5px;
                                top: 1px;
                                transform: rotate(-45deg);
                        }
                        }
                    @-webkit-keyframes bun-bot-out {
                            0% {
                                left: 0;
                                transform: rotate(0deg);
                        }
                            20% {
                                left: 0;
                                transform: rotate(-15deg);
                        }
                            80% {
                                left: -5px;
                                transform: rotate(60deg);
                        }
                            100% {
                                left: -5px;
                                transform: rotate(45deg);
                        }
                        }
                    @keyframes bun-bot-out {
                            0% {
                                left: 0;
                                transform: rotate(0deg);
                        }
                            20% {
                                left: 0;
                                transform: rotate(-15deg);
                        }
                            80% {
                                left: -5px;
                                transform: rotate(60deg);
                        }
                            100% {
                                left: -5px;
                                transform: rotate(45deg);
                        }
                        }
                    @-webkit-keyframes bun-top-in {
                            0% {
                            left: -5px;
                            bottom: 0;
                            transform: rotate(-45deg);
                    }
                        20% {
                            left: -5px;
                            bottom: 0;
                            transform: rotate(-60deg);
                    }
                        80% {
                            left: 0;
                            bottom: 0;
                            transform: rotate(15deg);
                    }
                        100% {
                            left: 0;
                            bottom: 1px;
                            transform: rotate(0deg);
                    }
                    }
                    @keyframes bun-top-in {
                            0% {
                            left: -5px;
                            bottom: 0;
                            transform: rotate(-45deg);
                    }
                        20% {
                            left: -5px;
                            bottom: 0;
                            transform: rotate(-60deg);
                    }
                        80% {
                            left: 0;
                            bottom: 0;
                            transform: rotate(15deg);
                    }
                        100% {
                            left: 0;
                            bottom: 1px;
                            transform: rotate(0deg);
                    }
                    }
                    @-webkit-keyframes bun-bot-in {
                            0% {
                            left: -5px;
                            transform: rotate(45deg);
                    }
                        20% {
                            left: -5px;
                            bottom: 0;
                            transform: rotate(60deg);
                    }
                        80% {
                            left: 0;
                            bottom: 0;
                            transform: rotate(-15deg);
                    }
                        100% {
                            left: 0;
                            transform: rotate(0deg);
                    }
                    }
                    @keyframes bun-bot-in {
                            0% {
                            left: -5px;
                            transform: rotate(45deg);
                    }
                        20% {
                            left: -5px;
                            bottom: 0;
                            transform: rotate(60deg);
                    }
                        80% {
                            left: 0;
                            bottom: 0;
                            transform: rotate(-15deg);
                    }
                        100% {
                            left: 0;
                            transform: rotate(0deg);
                    }
                    }
                    @-webkit-keyframes burger-fill-in {
                            0% {
                            width: 0;
                            left: 36px;
                        }
                        40% {
                            width: 0;
                            left: 40px;
                        }
                        80% {
                            width: 36px;
                            left: -6px;
                        }
                        100% {
                            width: 36px;
                            left: 0;
                        }
                    }
                    @keyframes burger-fill-in {
                            0% {
                            width: 0;
                            left: 36px;
                        }
                        40% {
                            width: 0;
                            left: 40px;
                        }
                        80% {
                            width: 36px;
                            left: -6px;
                        }
                        100% {
                            width: 36px;
                            left: 0;
                        }
                    }
                    @-webkit-keyframes burger-fill-out {
                            0% {
                                width: 36px;
                                left: 0;
                            }
                            20% {
                                width: 42px;
                                left: -6px;
                            }
                            40% {
                                width: 0;
                                left: 40px;
                            }
                            100% {
                                width: 0;
                                left: 36px;
                            }
                        }
                    @keyframes burger-fill-out {
                            0% {
                                width: 36px;
                                left: 0;
                            }
                            20% {
                                width: 42px;
                                left: -6px;
                            }
                            40% {
                                width: 0;
                                left: 40px;
                            }
                            100% {
                                width: 0;
                                left: 36px;
                            }
                        }
                    </style>`;
                main_layout_style.innerHTML += `<style>
                    div.${helper_list_name} {
                        position: absolute;
                        top: 10px;
                        right: 0;
                        display: inline-block;
                        margin: 10px;
                        background-color: #fff;
                        z-index: 99;
                        transition: all 0.2s ease;
                    }
                    div.${helper_list_name} p {
                        text-align: right;
                        margin: 0 0 0 0;
                        padding: 0 10px;
                        font-size: 11px;
                    }
                    div.${helper_list_name} ul {
                        position: fixed;
                        top: 90px;
                        right: 45px;
                        display: inline-block;
                        width: max-content;
                        list-style: none;
                        list-style-position: outside;
                        border-radius: 2px;
                        border: 1px solid #373737;
                        box-shadow: 0 1px 5px rgba(85, 85, 85, 0.15);
                        margin: 0;
                        padding: 0;
                        background-color: rgba(41 41 41 / 0.05);
                        -webkit-backdrop-filter: blur(5px);
                        backdrop-filter: blur(3px);
                        transition: all 0.2s ease;
                    }
                    div.${helper_list_name} ul li {
                        padding: 0 10px 5px;
                    }
                    div.${helper_list_name} a {
                        padding: 6px;
                        transition: all 0.2s ease;
                        background-color: rgba(41 41 41 / 0.05);
                    }
                    div.${helper_list_name} a:hover {
                        color: #442F74;
                        transition: all 0.2s ease;
                        text-decoration: none;
                        background-color: #efefef;
                    }
                    div.${helper_list_name} span {
                        margin-bottom: 20px;
                    }
                    .helper-btn {
                        font-family: \\"Open Sans\\", sans-serif;
                        font-size: 9px;
                        letter-spacing: 1px;
                        text-decoration: none;
                        text-transform: uppercase;
                        color: #1f1f1f; /*#ebeaea*/
                        cursor: pointer;
                        border: 3px solid;
                        padding: 0.25em 0.5em;
                        box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
                        position: relative;
                        display: inline-block;
                        -moz-user-select: none;
                         -ms-user-select: none;
                             user-select: none;
                        -webkit-user-select: none;
                        touch-action: manipulation;
                        margin: 4px 2px;
                    }
                    @media (min-width: 768px) {
                        .helper-btn {
                          padding: 0.25em 0.75em;
                        }
                    }
                    .helper-btn:active {
                        box-shadow: 0px 0px 0px 0px;
                        top: 5px;
                        left: 5px;
                    }
                    .copied {
                        color: #298d7a;
                    }
                </style>`;

                document.body.appendChild(main_layout_style);
            };
            const toggle_drawer = (toggle) => {
                let drawer = document.querySelector(`.${helper_list_name}`);
                if (!toggle) {
                    drawer.style.transform = "translate(1000px, 0)";
                } else {
                    drawer.style.transform = "translate(0, 0)";
                }
            };
            const trigger_floating_hamburger_anchor = () => {
                let trigger = document.getElementById("hamburger"),
                    isClosed = true;

                const burgerAnimate = () => {
                    if (isClosed === true) {
                        trigger.classList.remove("is-open");
                        trigger.classList.add("is-closed");
                        isClosed = false;
                        this.hamburger_keypress_state = true;
                    } else {
                        trigger.classList.remove("is-closed");
                        trigger.classList.add("is-open");
                        isClosed = true;
                        this.hamburger_keypress_state = false;
                        this.close_pg_table_by_spacebar();
                    }
                    toggle_drawer(isClosed);
                };

                trigger.addEventListener("click", burgerAnimate);
            };
            const entrance_animate_drawer = () => {
                let drawer = document.querySelector(`.${helper_list_name}`);
                drawer.style.transform = "translate(325px, 0)";
                setTimeout(function () {
                    drawer.style.transform = "translate(0, 0)";
                }, 300);
            };
            drawer_menu_layout_html();
            drawer_menu_layout_style();
            trigger_floating_hamburger_anchor();
            entrance_animate_drawer();
        },
        today_date: function () {
            const todayDateTime = new Date();
            const year = todayDateTime.getFullYear();
            const day = new Date().toLocaleDateString("en-us", {
                day: "numeric",
            });
            const dayOfMonth = todayDateTime.getDate();
            let ordinal;
            if (dayOfMonth >= 11 && dayOfMonth <= 13) {
                ordinal = "th"; // if the day is between 11 and 13, use 'th'
            } else {
                switch (dayOfMonth % 10) {
                    case 1:
                        ordinal = "st";
                        break;
                    case 2:
                        ordinal = "nd";
                        break;
                    case 3:
                        ordinal = "rd";
                        break;
                    default:
                        ordinal = "th";
                        break;
                }
            }
            const month = new Date().toLocaleDateString("en-us", {
                month: "short",
            });
            return `${day}${ordinal} ${month}, ${year}`;
        },
        get_mail_subject: function () {
            let html_placeholder = document.createElement("div");
            html_placeholder.innerHTML = `Daily report, Omprakash, ${this.today_date()}`;
            return html_placeholder;
        },
        append_to_parent: function (child) {
            document
                .querySelector(`.${this.helper_list_name}`)
                .children[0].appendChild(child);
        },
        add_li_daily_report_title: function () {
            let that = this;
            let class_btn = ".helper-daily-report-subject";

            let report_subject = document.createElement("li");
            report_subject.innerHTML = `<p style="color:#575757;"><strong>Daily report helper</strong></p>
                                        <div class="tools">
                                            <a class="${class_btn.slice(
                                                1
                                            )} helper-btn" href="#">Copy Daily report subject</a>
                                        </div>`;
            this.append_to_parent(report_subject);

            const helper_btn = document.querySelector(class_btn);
            helper_btn.addEventListener("click", function (event) {
                event.preventDefault();
                that.copy_to_clipboard(that.get_mail_subject(), helper_btn);
            });
        },
        add_li_copy_email_body_with_subject_btn: function () {
            const subject =
                document.querySelector("#ConversationReadingPaneContainer") ||
                "";
            this.add_li_copy_email_btn(subject);
        },
        add_li_copy_email_btn: function (subject = "") {
            let subj = subject || "";
            let that = this;
            // console.log("subj", subj);
            // var subj at most can be use up to creating the button and register click listener,
            // beyond this the button listener needs to get the selector again on each click so maybe
            // can refactor by adding a data attr to what selector to pass in for the screen capture.
            let btn_name = subj === "" ? `仅-复制-邮件-正文` : `复制-完整-邮件`;
            let li_copy_email_body = document.createElement("li");
            li_copy_email_body.innerHTML = (function (subj) {
                return subj === ""
                    ? `<div class="tools copy_email_body"><a id="ss-email-body" class="helper-btn copy_email_btn" data-ss-button-name="${btn_name}">${btn_name}</a></div>`
                    : `<div class="tools copy_email_body"><a id="ss-email-title-body" class="helper-btn copy_email_btn" data-ss-button-name="${btn_name}">${btn_name}</a></div>`;
            })(subj);
            const css = document.createTextNode(
                `
.copy-failed {
    background-color: red;
    color: #fff;
}
`
            );
            const styleElement = document.createElement("style");
            styleElement.appendChild(css);
            document.head.appendChild(styleElement);

            this.append_to_parent(li_copy_email_body);

            const helper_btn =
                subj === ""
                    ? li_copy_email_body.querySelector("#ss-email-body")
                    : li_copy_email_body.querySelector("#ss-email-title-body");
            helper_btn.addEventListener("click", function (event) {
                event.preventDefault();
                console.log("event.currentTarget", event.currentTarget);
                let targetElem =
                    event.currentTarget.getAttribute("id") === "ss-email-body"
                        ? document.querySelector(".Q8TCC.yyYQP > div")
                        : document.querySelector(
                              "#ConversationReadingPaneContainer"
                          );
                console.log("targetElem", targetElem);
                targetElem &&
                    that.captureScreenshot(targetElem, event.currentTarget);
            });
        },
        add_li_form_test_table: function () {
            let that = this;
            let form_test_arr = [
                "https://www.hrdacademy.asia/course-enquiry/",
                "https://www.courseadvisor.asia/course-enquiry/",
                "https://www.bac.edu.my/course-enquiry/",
                "https://www.bac.edu.my/enquire-now/",
                "https://www.iact.edu.my/course-enquiry/",
                "https://www.veritas.edu.my/course-enquiry/",
                "https://www.reliance.edu.my/course-enquiry/",
                "https://www.bac.edu.sg/course-enquiry/",
                "https://www.baccollege.edu.my/course-enquiry/",
                "https://www.bac.edu.my/certificate-in-legal-practice/",
                "https://www.bac.edu.my/postgraduate/",
                "https://www.bac.edu.my/top-students/",
                "https://www.bac.edu.my/student-residences/",
                "https://www.veritas.edu.my/bank-rakyat-promosi/",
                "https://www.veritas.edu.my/next-gen-ultimate-mba/",
                "https://www.veritas.edu.my/next-gen-mba/",
                "https://www.reliance.edu.my/hospitality/",
                "https://www.veritascollege.edu.my/",
                "https://www.courseadvisor.asia/general-enquiry/",
                "https://www.courseadvisor.asia/school-visits/",
                "https://www.courseadvisor.asia/partnerships-unit/",
                "https://www.iact.edu.my/2023-intakes-now-open/",
                "https://www.iact.edu.my/general-enquiries/",
                "https://www.baccollege.edu.my/general-enquiry/",
                "https://www.bac.edu.my/general-enquiry/",
                "https://www.veritas.edu.my/general-enquiry/",
                "https://www.reliance.edu.my/general-enquiry/",
                "https://www.bac.edu.sg/general-enquiry/",
                "https://www.iact.edu.my/uktmc/",
                "https://www.bac2school.my/",
                "https://www.bac2school.my/integrating-technology-in-teaching/",
                "https://www.bac2school.my/integrating-technology-in-teaching-kj/",
                "BACPAC BOOKING",
                "https://www.bac.edu.my/clpinfosession/",
            ];
            let date_string = new Date().toLocaleDateString("en-us", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            let form_test_string = `FORM_TEST_OM_${date_string}`;
            let checkbox_container = document.createElement("div");
            checkbox_container.style.cssText =
                "position:relative; display:block;";

            const style = document.createTextNode(
                `
.btn-wrap-form-test-om:hover {
    outline: solid 2px #28435F;
    transition: all 0.2s ease;
    border-radius: 3px;
}
.btn-wrap-form-test-om {
    padding: 2px;
    outline: solid 0px #28435F;
    transition: all 0.3s ease;
    border-radius: 3px;
}
.form_test_om_btn {
    cursor: pointer;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 3px;
    margin-bottom: 5px;
    font-size: 11px;
    border: solid 2px #bfbfbf;
    color: #bfbfbf;
    /*outline: solid 2px white;*/
    /*border: solid 2px black;*/
    margin-top: 5px
 }
.hide_form_test + .form_test_om {
    display:none !important;
}
`
            );
            const styleElement = document.createElement("style");
            styleElement.appendChild(style);
            document.head.appendChild(styleElement);

            setTimeout(function () {
                // wait for the html element to finish load and be available
                form_test_arr.forEach(function (item, index) {
                    let btn_wrapper = document.createElement("div");
                    let btn_input = document.createElement("input");
                    let btn_label = document.createElement("label");
                    let string_to_search = `${item} AND ${form_test_string}`;

                    btn_wrapper.classList.add("btn-wrap-form-test-om");
                    btn_input.style.cssText =
                        "transform: scale(1.2); margin-right: 10px;";
                    btn_label.style.cssText =
                        "cursor: pointer; font-size: 14px; font-weight:600;";

                    btn_input.value = string_to_search;
                    btn_input.type = "checkbox";
                    btn_input.name = btn_input.id = `form_test_om_${index}`;

                    btn_label.setAttribute("for", btn_input.name);
                    btn_label.innerText = btn_input.value;

                    btn_label.addEventListener("click", function (event) {
                        const htmlFor = event.target.htmlFor;
                        const the_input = document.getElementById(htmlFor);

                        that.copy_to_clipboard(the_input, the_input);
                        document.querySelector(".owaSearchBox").click();
                        //.value = the_input.innerHTML;
                    });

                    btn_wrapper.appendChild(btn_input);
                    btn_wrapper.appendChild(btn_label);
                    checkbox_container.appendChild(btn_wrapper);
                });

                let form_test_li = document.createElement("li");
                form_test_li.innerHTML = `<button class="hide_form_test form_test_om_btn">${form_test_string}</button>
                                        <div class="tools form_test_om">
                                        </div>`;

                // 1. first append to the parent
                that.append_to_parent(form_test_li);

                // 2. after that, we look for the child element on the parent to append once more, then event lister can work properly
                let form_test_om = document.querySelector(".form_test_om");
                form_test_om.appendChild(checkbox_container);

                let hide_form_test =
                    document.getElementsByClassName("hide_form_test")[0];
                hide_form_test.addEventListener("click", function (event) {
                    hide_form_test.classList.toggle("hide_form_test");
                    that.copy_to_clipboard(
                        event.currentTarget,
                        event.currentTarget
                    );
                });
            }, 3000);
        },
        get_today_email_filter_text: function () {
            function formatDate(date) {
                let day = date.getDate();
                let month = date.getMonth() + 1; // Month is zero-based, so we add 1
                let year = date.getFullYear() % 100; // Get last two digits of the year

                day = day < 10 ? "0" + day : day;
                month = month < 10 ? "0" + month : month;
                year = year < 10 ? "0" + year : year;

                return `${month.toString()}/${day.toString()}/${year.toString()}`;
            }
            const currentDate = new Date();
            const formattedDate = formatDate(currentDate);
            const wrapper = document.createElement("div");
            wrapper.textContent = `received:${formattedDate}`;
            return wrapper;
        },
        get_email_from_filter_by: function () {
            return {
                pAll: "isread:no from:omprakash.p@bac.edu.my to:omprakash.p@bac.edu.my from:a.jalalludin@bac.edu.my to:a.jalalludin@bac.edu.my from:adrian@bac.edu.my to:adrian@bac.edu.my from:afiq@bac.edu.my to:afiq@bac.edu.my from:akalili@bac.edu.my to:akalili@bac.edu.my from:aliah.a@bac.edu.my to:aliah.a@bac.edu.my from:amalia.n@bac.edu.my to:amalia.n@bac.edu.my from:ambros@bac.edu.my to:ambros@bac.edu.my from:amenda@bac.edu.my to:amenda@bac.edu.my from:amir@bac.edu.my to:amir@bac.edu.my from:amreeta@bac.edu.my to:amreeta@bac.edu.my from:andrew_skalish@bac.edu.my to:andrew_skalish@bac.edu.my from:ann.m@bac.edu.my to:ann.m@bac.edu.my from:Anne@bac.edu.my to:Anne@bac.edu.my from:annemoses@bac.edu.my to:annemoses@bac.edu.my from:anneshyamala@bac.edu.my to:anneshyamala@bac.edu.my from:anusooya@bac.edu.my to:anusooya@bac.edu.my from:aria@bac.edu.my to:aria@bac.edu.my from:arif.r@bac.edu.my to:arif.r@bac.edu.my from:arivinth@bac.edu.my to:arivinth@bac.edu.my from:arul@bac.edu.my to:arul@bac.edu.my from:azahari@bac.edu.my to:azahari@bac.edu.my from:azrina.c@bac.edu.my to:azrina.c@bac.edu.my from:baljeet@bac.edu.my to:baljeet@bac.edu.my from:cally.c@bac.edu.my to:cally.c@bac.edu.my from:carrot@bac.edu.my to:carrot@bac.edu.my from:chandra@bac.edu.my to:chandra@bac.edu.my from:charlene.as@bac.edu.my to:charlene.as@bac.edu.my from:chrisandra@bac.edu.my to:chrisandra@bac.edu.my from:Chrishnaveni@bac.edu.my to:Chrishnaveni@bac.edu.my from:DanielPhilip@bac.edu.my to:DanielPhilip@bac.edu.my from:dasshany.p@bac.edu.my to:dasshany.p@bac.edu.my from:deborah.m@bac.edu.my to:deborah.m@bac.edu.my from:deeban@bac.edu.my to:deeban@bac.edu.my from:deva@bac.edu.my to:deva@bac.edu.my from:devipatrik@bac.edu.my to:devipatrik@bac.edu.my from:dhanya.s@bac.edu.my to:dhanya.s@bac.edu.my from:diana@bac.edu.my to:diana@bac.edu.my from:dridan@bac.edu.my to:dridan@bac.edu.my from:eireen.s@bac.edu.my to:eireen.s@bac.edu.my from:elaine.k@bac.edu.my to:elaine.k@bac.edu.my from:eliza.sf@bac.edu.my to:eliza.sf@bac.edu.my from:elizabethchen@bac.edu.my to:elizabethchen@bac.edu.my from:fadzli.h@bac.edu.my to:fadzli.h@bac.edu.my from:fairuz@bac.edu.my to:fairuz@bac.edu.my from:farid@faceberry.com.my to:farid@faceberry.com.my from:fatimah.a@bac.edu.my to:fatimah.a@bac.edu.my from:feroz.m@bac.edu.my to:feroz.m@bac.edu.my from:firdauz.a@bac.edu.my to:firdauz.a@bac.edu.my from:gandhimathi@bac.edu.my to:gandhimathi@bac.edu.my from:ganesh2@bac.edu.my to:ganesh2@bac.edu.my from:geetha@bac.edu.my to:geetha@bac.edu.my from:ghayathri.k@bac.edu.my to:ghayathri.k@bac.edu.my from:gobinath@bac.edu.my to:gobinath@bac.edu.my from:gopalakrishnan.p@bac.edu.my to:gopalakrishnan.p@bac.edu.my from:gurpreet.s@bac.edu.my to:gurpreet.s@bac.edu.my from:hafiz.i@bac.edu.my to:hafiz.i@bac.edu.my from:haliyah@bac.edu.my to:haliyah@bac.edu.my from:haritharagopala.b@bac.edu.my to:haritharagopala.b@bac.edu.my from:harjindarkaur@bac.edu.my to:harjindarkaur@bac.edu.my from:harrsha.m@bac.edu.my to:harrsha.m@bac.edu.my from:hidayah.b@bac.edu.my to:hidayah.b@bac.edu.my from:hokoh.m@bac.edu.my to:hokoh.m@bac.edu.my from:jackie.u@bac.edu.my to:jackie.u@bac.edu.my from:jaswin@bac.edu.my to:jaswin@bac.edu.my from:jay@bac.edu.my to:jay@bac.edu.my from:jc@bac.edu.my to:jc@bac.edu.my from:jeanie.ls@bac.edu.my to:jeanie.ls@bac.edu.my from:Jegathesvaran.j@bac.edu.my to:Jegathesvaran.j@bac.edu.my from:jennifer@bac.edu.my to:jennifer@bac.edu.my from:joshua.k@bac.edu.my to:joshua.k@bac.edu.my from:joshua@bac.edu.my to:joshua@bac.edu.my from:Julie@bac.edu.my to:Julie@bac.edu.my from:kalaivani.k@bac.edu.my to:kalaivani.k@bac.edu.my from:kalyani@bac.edu.my to:kalyani@bac.edu.my from:kanesar@bac.edu.my to:kanesar@bac.edu.my from:kasim@bac.edu.my to:kasim@bac.edu.my from:kavitha@bac.edu.my to:kavitha@bac.edu.my from:khairul.a@bac.edu.my to:khairul.a@bac.edu.my from:khairunnisa.m@bac.edu.my to:khairunnisa.m@bac.edu.my from:khalidah@bac.edu.my to:khalidah@bac.edu.my from:kishor@bac.edu.my to:kishor@bac.edu.my from:kithambari.n@bac.edu.my to:kithambari.n@bac.edu.my from:kogelavani.r@bac.edu.my to:kogelavani.r@bac.edu.my from:komalavasan.t@bac.edu.my to:komalavasan.t@bac.edu.my from:kopal.t@bac.edu.my to:kopal.t@bac.edu.my from:kuan.kf@bac.edu.my to:kuan.kf@bac.edu.my from:kumar.n@bac.edu.my to:kumar.n@bac.edu.my from:lalitha.k@bac.edu.my to:lalitha.k@bac.edu.my from:lavinia@bac.edu.my to:lavinia@bac.edu.my from:leroshana.r@bac.edu.my to:leroshana.r@bac.edu.my from:leshanth.r@bac.edu.my to:leshanth.r@bac.edu.my from:lktan@bac.edu.my to:lktan@bac.edu.my from:logeswaran@bac.edu.my to:logeswaran@bac.edu.my from:m.bhawani@bac.edu.my to:m.bhawani@bac.edu.my from:mahanom@bac.edu.my to:mahanom@bac.edu.my from:maisarah.r@bac.edu.my to:maisarah.r@bac.edu.my from:malini.c@bac.edu.my to:malini.c@bac.edu.my from:maryg@bac.edu.my to:maryg@bac.edu.my from:meera@bac.edu.my to:meera@bac.edu.my from:Mike.f@bac.edu.my to:Mike.f@bac.edu.my from:minoosha.d@bac.edu.my to:minoosha.d@bac.edu.my from:mithila@bac.edu.my to:mithila@bac.edu.my from:mohana.s@bac.edu.my to:mohana.s@bac.edu.my from:mokana.r@bac.edu.my to:mokana.r@bac.edu.my from:Moo@bac.edu.my to:Moo@bac.edu.my from:murali@bac.edu.my to:murali@bac.edu.my from:muralidharan@bac.edu.my to:muralidharan@bac.edu.my from:murugan@bac.edu.my to:murugan@bac.edu.my from:mustafha@bac.edu.my to:mustafha@bac.edu.my from:nadar@bac.edu.my to:nadar@bac.edu.my from:nadia.k@bac.edu.my to:nadia.k@bac.edu.my from:najiah@bac.edu.my to:najiah@bac.edu.my from:nal@bac.edu.my to:nal@bac.edu.my from:nasaruddin.bz@bac.edu.my to:nasaruddin.bz@bac.edu.my from:nathan.t@bac.edu.my to:nathan.t@bac.edu.my from:nazmi.k@bac.edu.my to:nazmi.k@bac.edu.my from:niranjalah.r@bac.edu.my to:niranjalah.r@bac.edu.my from:nirmitha.g@bac.edu.my to:nirmitha.g@bac.edu.my from:nirmitha@faceberry.com.my to:nirmitha@faceberry.com.my from:nithiyah.t@bac.edu.my to:nithiyah.t@bac.edu.my from:noorazian.mn@bac.edu.my to:noorazian.mn@bac.edu.my from:norazreen.bb@bac.edu.my to:norazreen.bb@bac.edu.my from:norhafizah@bac.edu.my to:norhafizah@bac.edu.my from:nurshazwani@bac.edu.my to:nurshazwani@bac.edu.my from:nurul@bac.edu.my to:nurul@bac.edu.my from:p.kavita@bac.edu.my to:p.kavita@bac.edu.my from:padma@bac.edu.my to:padma@bac.edu.my from:pardeepkaur@bac.edu.my to:pardeepkaur@bac.edu.my from:paul.w@bac.edu.my to:paul.w@bac.edu.my from:pikwah.l@bac.edu.my to:pikwah.l@bac.edu.my from:pritamkaur.ss@bac.edu.my to:pritamkaur.ss@bac.edu.my from:rachel.m@bac.edu.my to:rachel.m@bac.edu.my from:rachelann@bac.edu.my to:rachelann@bac.edu.my from:rahmatullah.r@bac.edu.my to:rahmatullah.r@bac.edu.my from:rajkumar@bac.edu.my to:rajkumar@bac.edu.my from:ranjaniy@bac.edu.my to:ranjaniy@bac.edu.my from:ravichandran@bac.edu.my to:ravichandran@bac.edu.my from:raymond@bac.edu.my to:raymond@bac.edu.my from:raymondjr@bac.edu.my to:raymondjr@bac.edu.my from:rekha@bac.edu.my to:rekha@bac.edu.my from:renuka@bac.edu.my to:renuka@bac.edu.my from:reuben@bac.edu.my to:reuben@bac.edu.my from:reubenrozario@bac.edu.my to:reubenrozario@bac.edu.my from:rubithra.g@bac.edu.my to:rubithra.g@bac.edu.my from:saiful.adli@bac.edu.my to:saiful.adli@bac.edu.my from:sanjey.k@bac.edu.my to:sanjey.k@bac.edu.my from:sapnakaur@bac.edu.my to:sapnakaur@bac.edu.my from:sarvesh@bac.edu.my to:sarvesh@bac.edu.my from:selvamalar.a@bac.edu.my to:selvamalar.a@bac.edu.my from:shahril.m@bac.edu.my to:shahril.m@bac.edu.my from:shahrudin.g@bac.edu.my to:shahrudin.g@bac.edu.my from:sham@bac.edu.my to:sham@bac.edu.my from:sharmila.s@bac.edu.my to:sharmila.s@bac.edu.my from:sharon@bac.edu.my to:sharon@bac.edu.my from:shastininair@bac.edu.my to:shastininair@bac.edu.my from:shenoj.v@bac.edu.my to:shenoj.v@bac.edu.my from:shizreen@bac.edu.my to:shizreen@bac.edu.my from:shubashini.t@bac.edu.my to:shubashini.t@bac.edu.my from:shukor.f@bac.edu.my to:shukor.f@bac.edu.my from:silas.l@bac.edu.my to:silas.l@bac.edu.my from:sitirosazlin.br@bac.edu.my to:sitirosazlin.br@bac.edu.my from:siva.n@bac.edu.my to:siva.n@bac.edu.my from:sridatta@bac.edu.my to:sridatta@bac.edu.my from:stanislaus.m@bac.edu.my to:stanislaus.m@bac.edu.my from:stevie.t@bac.edu.my to:stevie.t@bac.edu.my from:sudesh@bac.edu.my to:sudesh@bac.edu.my from:surinder@bac.edu.my to:surinder@bac.edu.my from:t.nyokfah@bac.edu.my to:t.nyokfah@bac.edu.my from:tengku.f@bac.edu.my to:tengku.f@bac.edu.my from:tengku.js@bac.edu.my to:tengku.js@bac.edu.my from:theeban@bac.edu.my to:theeban@bac.edu.my from:theresa@bac.edu.my to:theresa@bac.edu.my from:Thila@bac.edu.my to:Thila@bac.edu.my from:thillairaj.r@bac.edu.my to:thillairaj.r@bac.edu.my from:trupti.s@bac.edu.my to:trupti.s@bac.edu.my from:usharani@bac.edu.my to:usharani@bac.edu.my from:valarmathi@bac.edu.my to:valarmathi@bac.edu.my from:vanaja.r@bac.edu.my to:vanaja.r@bac.edu.my from:vicknesh@bac.edu.my to:vicknesh@bac.edu.my from:vijaiyan.k@bac.edu.my to:vijaiyan.k@bac.edu.my from:vinayagamurthi@bac.edu.my to:vinayagamurthi@bac.edu.my from:wansalihah@bac.edu.my to:wansalihah@bac.edu.my from:zahier@bac.edu.my to:zahier@bac.edu.my from:zulazli@bac.edu.my to:zulazli@bac.edu.my from:acadunit@reliance.edu.my to:acadunit@reliance.edu.my from:afifah.s@iact.edu.my to:afifah.s@iact.edu.my from:aidatul.anis@bac.edu.my to:aidatul.anis@bac.edu.my from:aimifarhana.i@bac.edu.my to:aimifarhana.i@bac.edu.my from:ainsyafiqah@iact.edu.my to:ainsyafiqah@iact.edu.my from:akmal@iact.edu.my to:akmal@iact.edu.my from:aleyyah.a@bac.edu.my to:aleyyah.a@bac.edu.my from:alfred@iact.edu.my to:alfred@iact.edu.my from:alice@iact.edu.my to:alice@iact.edu.my from:allen.j@bac.edu.my to:allen.j@bac.edu.my from:amanda.r@iact.edu.my to:amanda.r@iact.edu.my from:amanda@makeitrightmovement.com to:amanda@makeitrightmovement.com from:amanina.h@bac.edu.my to:amanina.h@bac.edu.my from:aminaffendi@iact.edu.my to:aminaffendi@iact.edu.my from:aminuddin@iact.edu.my to:aminuddin@iact.edu.my from:anahita.g@bac.edu.my to:anahita.g@bac.edu.my from:ang.y@veritascollege.edu.my to:ang.y@veritascollege.edu.my from:anuar@iact.edu.my to:anuar@iact.edu.my from:awang.i@veritascollege.edu.my to:awang.i@veritascollege.edu.my from:ayuamirah.m@bac.edu.my to:ayuamirah.m@bac.edu.my from:azahari@faceberry.com.my to:azahari@faceberry.com.my from:azizul@iact.edu.my to:azizul@iact.edu.my from:azlina.s@veritas.edu.my to:azlina.s@veritas.edu.my from:azlina@iact.edu.my to:azlina@iact.edu.my from:azreen@iact.edu.my to:azreen@iact.edu.my from:azura.b@veritas.edu.my to:azura.b@veritas.edu.my from:azwan@iact.edu.my to:azwan@iact.edu.my from:balamurugan.p@bac.edu.my to:balamurugan.p@bac.edu.my from:brandon@bac.edu.my to:brandon@bac.edu.my from:brian@makeitrightmovement.com to:brian@makeitrightmovement.com from:charliechu@reliance.edu.my to:charliechu@reliance.edu.my from:charoen@iact.edu.my to:charoen@iact.edu.my from:chee.kin@bac.edu.my to:chee.kin@bac.edu.my from:chenghoe.c@bac.edu.my to:chenghoe.c@bac.edu.my from:chinkent.c@bac.edu.my to:chinkent.c@bac.edu.my from:cyrus.tan@iact.edu.my to:cyrus.tan@iact.edu.my from:darishani.r@bac.edu.my to:darishani.r@bac.edu.my from:david@bac.edu.my to:david@bac.edu.my from:Deepa@iact.edu.my to:Deepa@iact.edu.my from:dhevaania.g@veritas.edu.my to:dhevaania.g@veritas.edu.my from:dr.marygeorge@bac.edu.my to:dr.marygeorge@bac.edu.my from:elyena@iact.edu.my to:elyena@iact.edu.my from:emmy@iact.edu.my to:emmy@iact.edu.my from:ephesean.t@bac.edu.my to:ephesean.t@bac.edu.my from:eric.lim@bac.edu.my to:eric.lim@bac.edu.my from:ervina@iact.edu.my to:ervina@iact.edu.my from:esharry.r@bac.edu.my to:esharry.r@bac.edu.my from:farah@iact.edu.my to:farah@iact.edu.my from:fatin@iact.edu.my to:fatin@iact.edu.my from:fatinrosli@iact.edu.my to:fatinrosli@iact.edu.my from:fitriyah.z@bac.edu.my to:fitriyah.z@bac.edu.my from:ganeswari@bac.edu.my to:ganeswari@bac.edu.my from:gary.t@bac.edu.my to:gary.t@bac.edu.my from:gayathiri.v@bac.edu.my to:gayathiri.v@bac.edu.my from:gayathri.m@bac.edu.my to:gayathri.m@bac.edu.my from:geethannchali.s@bac.edu.my to:geethannchali.s@bac.edu.my from:govin@bac.edu.my to:govin@bac.edu.my from:gurjitsingh@bac.edu.my to:gurjitsingh@bac.edu.my from:hadri.o@bac.edu.my to:hadri.o@bac.edu.my from:hafiz@veritascollege.edu.my to:hafiz@veritascollege.edu.my from:halen.c@bac.edu.my to:halen.c@bac.edu.my from:hansini.t@bac.edu.my to:hansini.t@bac.edu.my from:hasliza@reliance.edu.my to:hasliza@reliance.edu.my from:hidayat.m@reliance.edu.my to:hidayat.m@reliance.edu.my from:hon.s@veritascollege.edu.my to:hon.s@veritascollege.edu.my from:hungying@iact.edu.my to:hungying@iact.edu.my from:IKE@bac.edu.my to:IKE@bac.edu.my from:iman.n@iact.edu.my to:iman.n@iact.edu.my from:imthiyaz@bac.edu.my to:imthiyaz@bac.edu.my from:intan@iact.edu.my to:intan@iact.edu.my from:irene.t@veritas.edu.my to:irene.t@veritas.edu.my from:iriscynthia.g@veritas.edu.my to:iriscynthia.g@veritas.edu.my from:irman.m@bac.edu.my to:irman.m@bac.edu.my from:Irwan@iact.edu.my to:Irwan@iact.edu.my from:isaac@reliance.edu.my to:isaac@reliance.edu.my from:ismalinda@iact.edu.my to:ismalinda@iact.edu.my from:izni.f@bac.edu.my to:izni.f@bac.edu.my from:jacinta@iact.edu.my to:jacinta@iact.edu.my from:Jaganraj@bac.edu.my to:Jaganraj@bac.edu.my from:janice.b@bac.edu.my to:janice.b@bac.edu.my from:Jason.c@veritascollege.edu.my to:Jason.c@veritascollege.edu.my from:jayne.l@bac.edu.my to:jayne.l@bac.edu.my from:jefvinder.j@bac.edu.my to:jefvinder.j@bac.edu.my from:jeremy.j@veritas.edu.my to:jeremy.j@veritas.edu.my from:jivaranee.n@veritas.edu.my to:jivaranee.n@veritas.edu.my from:johankondro@reliance.edu.my to:johankondro@reliance.edu.my from:joseph@iact.edu.my to:joseph@iact.edu.my from:julius.h@bac.edu.my to:julius.h@bac.edu.my from:kavitha@iact.edu.my to:kavitha@iact.edu.my from:kelvinhang.k@bac.edu.my to:kelvinhang.k@bac.edu.my from:kenneth@iact.edu.my to:kenneth@iact.edu.my from:kennethphilip.k@bac.edu.my to:kennethphilip.k@bac.edu.my from:Kent@reliance.edu.my to:Kent@reliance.edu.my from:ketheeswaran.p@bac.edu.my to:ketheeswaran.p@bac.edu.my from:khairul@iact.edu.my to:khairul@iact.edu.my from:khalidah@iact.edu.my to:khalidah@iact.edu.my from:kitei.wong@bac.edu.my to:kitei.wong@bac.edu.my from:lawrence@iact.edu.my to:lawrence@iact.edu.my from:leong@reliance.edu.my to:leong@reliance.edu.my from:lim.kw@reliance.edu.my to:lim.kw@reliance.edu.my from:loke.w@veritascollege.edu.my to:loke.w@veritascollege.edu.my from:luke@bac.edu.my to:luke@bac.edu.my from:mahalingam@reliance.edu.my to:mahalingam@reliance.edu.my from:mary@bac.edu.my to:mary@bac.edu.my from:mastura@reliance.edu.my to:mastura@reliance.edu.my from:meenaloshinee.m@bac.edu.my to:meenaloshinee.m@bac.edu.my from:Mekalah@iact.edu.my to:Mekalah@iact.edu.my from:mika.s@bac.edu.my to:mika.s@bac.edu.my from:muhammadazim.z@bac.edu.my to:muhammadazim.z@bac.edu.my from:munirah.m@bac.edu.my to:munirah.m@bac.edu.my from:nabila@iact.edu.my to:nabila@iact.edu.my from:nadia@iact.edu.my to:nadia@iact.edu.my from:nadirah.s@bac.edu.my to:nadirah.s@bac.edu.my from:nafisah.a@bac.edu.my to:nafisah.a@bac.edu.my from:nalini.c@veritas.edu.my to:nalini.c@veritas.edu.my from:nas@bac.edu.my to:nas@bac.edu.my from:natalie@iact.edu.my to:natalie@iact.edu.my from:naziranazari@bac.edu.my to:naziranazari@bac.edu.my from:nicholas.k@bac.edu.my to:nicholas.k@bac.edu.my from:nicola@iact.edu.my to:nicola@iact.edu.my from:nicole.p@bac.edu.my to:nicole.p@bac.edu.my from:nigel.gan@reliance.edu.my to:nigel.gan@reliance.edu.my from:nishallini@bac.edu.my to:nishallini@bac.edu.my from:noor@bac.edu.my to:noor@bac.edu.my from:noramirul.a@bac.edu.my to:noramirul.a@bac.edu.my from:norbaini.k@bac.edu.my to:norbaini.k@bac.edu.my from:norhasanah@iact.edu.my to:norhasanah@iact.edu.my from:norshahira.as@bac.edu.my to:norshahira.as@bac.edu.my from:nurainol.a@reliance.edu.my to:nurainol.a@reliance.edu.my from:nurfarahhanis.a@bac.edu.my to:nurfarahhanis.a@bac.edu.my from:nurliana_idaini@reliance.edu.my to:nurliana_idaini@reliance.edu.my from:nurulharnieza.a@bac.edu.my to:nurulharnieza.a@bac.edu.my from:nuruliffah.a@bac.edu.my to:nuruliffah.a@bac.edu.my from:parameswary.s@veritas.edu.my to:parameswary.s@veritas.edu.my from:parimalar.i@bac.edu.my to:parimalar.i@bac.edu.my from:pavitra.k@bac.edu.my to:pavitra.k@bac.edu.my from:predeep@bac.edu.my to:predeep@bac.edu.my from:R.Singham@bac.edu.my to:R.Singham@bac.edu.my from:rachel@iact.edu.my to:rachel@iact.edu.my from:radhi@iact.edu.my to:radhi@iact.edu.my from:rajasingham1000@gmail.com to:rajasingham1000@gmail.com from:registrar@reliance.edu.my to:registrar@reliance.edu.my from:renugadevi.a@bac.edu.my to:renugadevi.a@bac.edu.my from:rima.w@veritas.edu.my to:rima.w@veritas.edu.my from:rohaizat@iact.edu.my to:rohaizat@iact.edu.my from:rostheva@reliance.edu.my to:rostheva@reliance.edu.my from:rozita.s@bac.edu.my to:rozita.s@bac.edu.my from:sa@reliance.edu.my to:sa@reliance.edu.my from:sam.shubashini@bac.edu.my to:sam.shubashini@bac.edu.my from:satham.by@bac.edu.my to:satham.by@bac.edu.my from:shalini.m@veritas.edu.my to:shalini.m@veritas.edu.my from:shammalaa.r@bac.edu.my to:shammalaa.r@bac.edu.my from:shaqraz@makeitrightmovement.com to:shaqraz@makeitrightmovement.com from:sharasbok@iact.edu.my to:sharasbok@iact.edu.my from:sharifah.a@veritas.edu.my to:sharifah.a@veritas.edu.my from:sharmaine.s@bac.edu.my to:sharmaine.s@bac.edu.my from:sharon.p@bac.edu.my to:sharon.p@bac.edu.my from:shasthrika.b@bac.edu.my to:shasthrika.b@bac.edu.my from:shiuan.yap@iact.edu.my to:shiuan.yap@iact.edu.my from:shubashini.k@bac.edu.my to:shubashini.k@bac.edu.my from:sim.j@reliance.edu.my to:sim.j@reliance.edu.my from:sitifatunah@veritas.edu.my to:sitifatunah@veritas.edu.my from:stad@reliance.edu.my to:stad@reliance.edu.my from:suhan@makeitrightmovement.com to:suhan@makeitrightmovement.com from:syahiran.z@veritas.edu.my to:syahiran.z@veritas.edu.my from:syamimi@veritascollege.edu.my to:syamimi@veritascollege.edu.my from:tamilselvam.m@bac.edu.my to:tamilselvam.m@bac.edu.my from:tang.sc@reliance.edu.my to:tang.sc@reliance.edu.my from:teh.v@bac.edu.my to:teh.v@bac.edu.my from:tengkuadam.s@bac.edu.my to:tengkuadam.s@bac.edu.my from:thaddeus.g@bac.edu.my to:thaddeus.g@bac.edu.my from:tharshyini.m@bac.edu.my to:tharshyini.m@bac.edu.my from:tharunaganesh.r@bac.edu.my to:tharunaganesh.r@bac.edu.my from:thavanayagam@bac.edu.my to:thavanayagam@bac.edu.my from:thevaroobini@bac.edu.my to:thevaroobini@bac.edu.my from:thineshkumar@bac.edu.my to:thineshkumar@bac.edu.my from:timothy@iact.edu.my to:timothy@iact.edu.my from:vaani@reliance.edu.my to:vaani@reliance.edu.my from:valerie@makeitrightmovement.com to:valerie@makeitrightmovement.com from:venkata.v@veritas.edu.my to:venkata.v@veritas.edu.my from:vicky@iact.edu.my to:vicky@iact.edu.my from:vijayruben@bac.edu.my to:vijayruben@bac.edu.my from:vinod.j@bac.edu.my to:vinod.j@bac.edu.my from:waifun.c@bac.edu.my to:waifun.c@bac.edu.my from:wansiu.m@bac.edu.my to:wansiu.m@bac.edu.my from:yante@iact.edu.my to:yante@iact.edu.my from:yashotha.k@bac.edu.my to:yashotha.k@bac.edu.my from:yew.e@veritascollege.edu.my to:yew.e@veritascollege.edu.my from:yoges.achanah@reliance.edu.my to:yoges.achanah@reliance.edu.my from:zahir.z@bac.edu.my to:zahir.z@bac.edu.my from:charoen@bac.edu.my to:charoen@bac.edu.my from:haziq.h@bac.edu.my to:haziq.h@bac.edu.my from:damia.a@bac.edu.my to:damia.a@bac.edu.my from:irfan.e@bac.edu.my to:irfan.e@bac.edu.my from:prabawathi.r@bac.edu.my to:prabawathi.r@bac.edu.my from:anjanna.n@bac.edu.my to:anjanna.n@bac.edu.my from:sarjeen.t@bac.edu.my to:sarjeen.t@bac.edu.my",
                mAll: "isread:no -from:omprakash.p@bac.edu.my -to:omprakash.p@bac.edu.my -from:a.jalalludin@bac.edu.my -to:a.jalalludin@bac.edu.my -from:adrian@bac.edu.my -to:adrian@bac.edu.my -from:afiq@bac.edu.my -to:afiq@bac.edu.my -from:akalili@bac.edu.my -to:akalili@bac.edu.my -from:aliah.a@bac.edu.my -to:aliah.a@bac.edu.my -from:amalia.n@bac.edu.my -to:amalia.n@bac.edu.my -from:ambros@bac.edu.my -to:ambros@bac.edu.my -from:amenda@bac.edu.my -to:amenda@bac.edu.my -from:amir@bac.edu.my -to:amir@bac.edu.my -from:amreeta@bac.edu.my -to:amreeta@bac.edu.my -from:andrew_skalish@bac.edu.my -to:andrew_skalish@bac.edu.my -from:ann.m@bac.edu.my -to:ann.m@bac.edu.my -from:Anne@bac.edu.my -to:Anne@bac.edu.my -from:annemoses@bac.edu.my -to:annemoses@bac.edu.my -from:anneshyamala@bac.edu.my -to:anneshyamala@bac.edu.my -from:anusooya@bac.edu.my -to:anusooya@bac.edu.my -from:aria@bac.edu.my -to:aria@bac.edu.my -from:arif.r@bac.edu.my -to:arif.r@bac.edu.my -from:arivinth@bac.edu.my -to:arivinth@bac.edu.my -from:arul@bac.edu.my -to:arul@bac.edu.my -from:azahari@bac.edu.my -to:azahari@bac.edu.my -from:azrina.c@bac.edu.my -to:azrina.c@bac.edu.my -from:baljeet@bac.edu.my -to:baljeet@bac.edu.my -from:cally.c@bac.edu.my -to:cally.c@bac.edu.my -from:carrot@bac.edu.my -to:carrot@bac.edu.my -from:chandra@bac.edu.my -to:chandra@bac.edu.my -from:charlene.as@bac.edu.my -to:charlene.as@bac.edu.my -from:chrisandra@bac.edu.my -to:chrisandra@bac.edu.my -from:Chrishnaveni@bac.edu.my -to:Chrishnaveni@bac.edu.my -from:DanielPhilip@bac.edu.my -to:DanielPhilip@bac.edu.my -from:dasshany.p@bac.edu.my -to:dasshany.p@bac.edu.my -from:deborah.m@bac.edu.my -to:deborah.m@bac.edu.my -from:deeban@bac.edu.my -to:deeban@bac.edu.my -from:deva@bac.edu.my -to:deva@bac.edu.my -from:devipatrik@bac.edu.my -to:devipatrik@bac.edu.my -from:dhanya.s@bac.edu.my -to:dhanya.s@bac.edu.my -from:diana@bac.edu.my -to:diana@bac.edu.my -from:dridan@bac.edu.my -to:dridan@bac.edu.my -from:eireen.s@bac.edu.my -to:eireen.s@bac.edu.my -from:elaine.k@bac.edu.my -to:elaine.k@bac.edu.my -from:eliza.sf@bac.edu.my -to:eliza.sf@bac.edu.my -from:elizabethchen@bac.edu.my -to:elizabethchen@bac.edu.my -from:fadzli.h@bac.edu.my -to:fadzli.h@bac.edu.my -from:fairuz@bac.edu.my -to:fairuz@bac.edu.my -from:farid@faceberry.com.my -to:farid@faceberry.com.my -from:fatimah.a@bac.edu.my -to:fatimah.a@bac.edu.my -from:feroz.m@bac.edu.my -to:feroz.m@bac.edu.my -from:firdauz.a@bac.edu.my -to:firdauz.a@bac.edu.my -from:gandhimathi@bac.edu.my -to:gandhimathi@bac.edu.my -from:ganesh2@bac.edu.my -to:ganesh2@bac.edu.my -from:geetha@bac.edu.my -to:geetha@bac.edu.my -from:ghayathri.k@bac.edu.my -to:ghayathri.k@bac.edu.my -from:gobinath@bac.edu.my -to:gobinath@bac.edu.my -from:gopalakrishnan.p@bac.edu.my -to:gopalakrishnan.p@bac.edu.my -from:gurpreet.s@bac.edu.my -to:gurpreet.s@bac.edu.my -from:hafiz.i@bac.edu.my -to:hafiz.i@bac.edu.my -from:haliyah@bac.edu.my -to:haliyah@bac.edu.my -from:haritharagopala.b@bac.edu.my -to:haritharagopala.b@bac.edu.my -from:harjindarkaur@bac.edu.my -to:harjindarkaur@bac.edu.my -from:harrsha.m@bac.edu.my -to:harrsha.m@bac.edu.my -from:hidayah.b@bac.edu.my -to:hidayah.b@bac.edu.my -from:hokoh.m@bac.edu.my -to:hokoh.m@bac.edu.my -from:jackie.u@bac.edu.my -to:jackie.u@bac.edu.my -from:jaswin@bac.edu.my -to:jaswin@bac.edu.my -from:jay@bac.edu.my -to:jay@bac.edu.my -from:jc@bac.edu.my -to:jc@bac.edu.my -from:jeanie.ls@bac.edu.my -to:jeanie.ls@bac.edu.my -from:Jegathesvaran.j@bac.edu.my -to:Jegathesvaran.j@bac.edu.my -from:jennifer@bac.edu.my -to:jennifer@bac.edu.my -from:joshua.k@bac.edu.my -to:joshua.k@bac.edu.my -from:joshua@bac.edu.my -to:joshua@bac.edu.my -from:Julie@bac.edu.my -to:Julie@bac.edu.my -from:kalaivani.k@bac.edu.my -to:kalaivani.k@bac.edu.my -from:kalyani@bac.edu.my -to:kalyani@bac.edu.my -from:kanesar@bac.edu.my -to:kanesar@bac.edu.my -from:kasim@bac.edu.my -to:kasim@bac.edu.my -from:kavitha@bac.edu.my -to:kavitha@bac.edu.my -from:khairul.a@bac.edu.my -to:khairul.a@bac.edu.my -from:khairunnisa.m@bac.edu.my -to:khairunnisa.m@bac.edu.my -from:khalidah@bac.edu.my -to:khalidah@bac.edu.my -from:kishor@bac.edu.my -to:kishor@bac.edu.my -from:kithambari.n@bac.edu.my -to:kithambari.n@bac.edu.my -from:kogelavani.r@bac.edu.my -to:kogelavani.r@bac.edu.my -from:komalavasan.t@bac.edu.my -to:komalavasan.t@bac.edu.my -from:kopal.t@bac.edu.my -to:kopal.t@bac.edu.my -from:kuan.kf@bac.edu.my -to:kuan.kf@bac.edu.my -from:kumar.n@bac.edu.my -to:kumar.n@bac.edu.my -from:lalitha.k@bac.edu.my -to:lalitha.k@bac.edu.my -from:lavinia@bac.edu.my -to:lavinia@bac.edu.my -from:leroshana.r@bac.edu.my -to:leroshana.r@bac.edu.my -from:leshanth.r@bac.edu.my -to:leshanth.r@bac.edu.my -from:lktan@bac.edu.my -to:lktan@bac.edu.my -from:logeswaran@bac.edu.my -to:logeswaran@bac.edu.my -from:m.bhawani@bac.edu.my -to:m.bhawani@bac.edu.my -from:mahanom@bac.edu.my -to:mahanom@bac.edu.my -from:maisarah.r@bac.edu.my -to:maisarah.r@bac.edu.my -from:malini.c@bac.edu.my -to:malini.c@bac.edu.my -from:maryg@bac.edu.my -to:maryg@bac.edu.my -from:meera@bac.edu.my -to:meera@bac.edu.my -from:Mike.f@bac.edu.my -to:Mike.f@bac.edu.my -from:minoosha.d@bac.edu.my -to:minoosha.d@bac.edu.my -from:mithila@bac.edu.my -to:mithila@bac.edu.my -from:mohana.s@bac.edu.my -to:mohana.s@bac.edu.my -from:mokana.r@bac.edu.my -to:mokana.r@bac.edu.my -from:Moo@bac.edu.my -to:Moo@bac.edu.my -from:murali@bac.edu.my -to:murali@bac.edu.my -from:muralidharan@bac.edu.my -to:muralidharan@bac.edu.my -from:murugan@bac.edu.my -to:murugan@bac.edu.my -from:mustafha@bac.edu.my -to:mustafha@bac.edu.my -from:nadar@bac.edu.my -to:nadar@bac.edu.my -from:nadia.k@bac.edu.my -to:nadia.k@bac.edu.my -from:najiah@bac.edu.my -to:najiah@bac.edu.my -from:nal@bac.edu.my -to:nal@bac.edu.my -from:nasaruddin.bz@bac.edu.my -to:nasaruddin.bz@bac.edu.my -from:nathan.t@bac.edu.my -to:nathan.t@bac.edu.my -from:nazmi.k@bac.edu.my -to:nazmi.k@bac.edu.my -from:niranjalah.r@bac.edu.my -to:niranjalah.r@bac.edu.my -from:nirmitha.g@bac.edu.my -to:nirmitha.g@bac.edu.my -from:nirmitha@faceberry.com.my -to:nirmitha@faceberry.com.my -from:nithiyah.t@bac.edu.my -to:nithiyah.t@bac.edu.my -from:noorazian.mn@bac.edu.my -to:noorazian.mn@bac.edu.my -from:norazreen.bb@bac.edu.my -to:norazreen.bb@bac.edu.my -from:norhafizah@bac.edu.my -to:norhafizah@bac.edu.my -from:nurshazwani@bac.edu.my -to:nurshazwani@bac.edu.my -from:nurul@bac.edu.my -to:nurul@bac.edu.my -from:p.kavita@bac.edu.my -to:p.kavita@bac.edu.my -from:padma@bac.edu.my -to:padma@bac.edu.my -from:pardeepkaur@bac.edu.my -to:pardeepkaur@bac.edu.my -from:paul.w@bac.edu.my -to:paul.w@bac.edu.my -from:pikwah.l@bac.edu.my -to:pikwah.l@bac.edu.my -from:pritamkaur.ss@bac.edu.my -to:pritamkaur.ss@bac.edu.my -from:rachel.m@bac.edu.my -to:rachel.m@bac.edu.my -from:rachelann@bac.edu.my -to:rachelann@bac.edu.my -from:rahmatullah.r@bac.edu.my -to:rahmatullah.r@bac.edu.my -from:rajkumar@bac.edu.my -to:rajkumar@bac.edu.my -from:ranjaniy@bac.edu.my -to:ranjaniy@bac.edu.my -from:ravichandran@bac.edu.my -to:ravichandran@bac.edu.my -from:raymond@bac.edu.my -to:raymond@bac.edu.my -from:raymondjr@bac.edu.my -to:raymondjr@bac.edu.my -from:rekha@bac.edu.my -to:rekha@bac.edu.my -from:renuka@bac.edu.my -to:renuka@bac.edu.my -from:reuben@bac.edu.my -to:reuben@bac.edu.my -from:reubenrozario@bac.edu.my -to:reubenrozario@bac.edu.my -from:rubithra.g@bac.edu.my -to:rubithra.g@bac.edu.my -from:saiful.adli@bac.edu.my -to:saiful.adli@bac.edu.my -from:sanjey.k@bac.edu.my -to:sanjey.k@bac.edu.my -from:sapnakaur@bac.edu.my -to:sapnakaur@bac.edu.my -from:sarvesh@bac.edu.my -to:sarvesh@bac.edu.my -from:selvamalar.a@bac.edu.my -to:selvamalar.a@bac.edu.my -from:shahril.m@bac.edu.my -to:shahril.m@bac.edu.my -from:shahrudin.g@bac.edu.my -to:shahrudin.g@bac.edu.my -from:sham@bac.edu.my -to:sham@bac.edu.my -from:sharmila.s@bac.edu.my -to:sharmila.s@bac.edu.my -from:sharon@bac.edu.my -to:sharon@bac.edu.my -from:shastininair@bac.edu.my -to:shastininair@bac.edu.my -from:shenoj.v@bac.edu.my -to:shenoj.v@bac.edu.my -from:shizreen@bac.edu.my -to:shizreen@bac.edu.my -from:shubashini.t@bac.edu.my -to:shubashini.t@bac.edu.my -from:shukor.f@bac.edu.my -to:shukor.f@bac.edu.my -from:silas.l@bac.edu.my -to:silas.l@bac.edu.my -from:sitirosazlin.br@bac.edu.my -to:sitirosazlin.br@bac.edu.my -from:siva.n@bac.edu.my -to:siva.n@bac.edu.my -from:sridatta@bac.edu.my -to:sridatta@bac.edu.my -from:stanislaus.m@bac.edu.my -to:stanislaus.m@bac.edu.my -from:stevie.t@bac.edu.my -to:stevie.t@bac.edu.my -from:sudesh@bac.edu.my -to:sudesh@bac.edu.my -from:surinder@bac.edu.my -to:surinder@bac.edu.my -from:t.nyokfah@bac.edu.my -to:t.nyokfah@bac.edu.my -from:tengku.f@bac.edu.my -to:tengku.f@bac.edu.my -from:tengku.js@bac.edu.my -to:tengku.js@bac.edu.my -from:theeban@bac.edu.my -to:theeban@bac.edu.my -from:theresa@bac.edu.my -to:theresa@bac.edu.my -from:Thila@bac.edu.my -to:Thila@bac.edu.my -from:thillairaj.r@bac.edu.my -to:thillairaj.r@bac.edu.my -from:trupti.s@bac.edu.my -to:trupti.s@bac.edu.my -from:usharani@bac.edu.my -to:usharani@bac.edu.my -from:valarmathi@bac.edu.my -to:valarmathi@bac.edu.my -from:vanaja.r@bac.edu.my -to:vanaja.r@bac.edu.my -from:vicknesh@bac.edu.my -to:vicknesh@bac.edu.my -from:vijaiyan.k@bac.edu.my -to:vijaiyan.k@bac.edu.my -from:vinayagamurthi@bac.edu.my -to:vinayagamurthi@bac.edu.my -from:wansalihah@bac.edu.my -to:wansalihah@bac.edu.my -from:zahier@bac.edu.my -to:zahier@bac.edu.my -from:zulazli@bac.edu.my -to:zulazli@bac.edu.my -from:acadunit@reliance.edu.my -to:acadunit@reliance.edu.my -from:afifah.s@iact.edu.my -to:afifah.s@iact.edu.my -from:aidatul.anis@bac.edu.my -to:aidatul.anis@bac.edu.my -from:aimifarhana.i@bac.edu.my -to:aimifarhana.i@bac.edu.my -from:ainsyafiqah@iact.edu.my -to:ainsyafiqah@iact.edu.my -from:akmal@iact.edu.my -to:akmal@iact.edu.my -from:aleyyah.a@bac.edu.my -to:aleyyah.a@bac.edu.my -from:alfred@iact.edu.my -to:alfred@iact.edu.my -from:alice@iact.edu.my -to:alice@iact.edu.my -from:allen.j@bac.edu.my -to:allen.j@bac.edu.my -from:amanda.r@iact.edu.my -to:amanda.r@iact.edu.my -from:amanda@makeitrightmovement.com -to:amanda@makeitrightmovement.com -from:amanina.h@bac.edu.my -to:amanina.h@bac.edu.my -from:aminaffendi@iact.edu.my -to:aminaffendi@iact.edu.my -from:aminuddin@iact.edu.my -to:aminuddin@iact.edu.my -from:anahita.g@bac.edu.my -to:anahita.g@bac.edu.my -from:ang.y@veritascollege.edu.my -to:ang.y@veritascollege.edu.my -from:anuar@iact.edu.my -to:anuar@iact.edu.my -from:awang.i@veritascollege.edu.my -to:awang.i@veritascollege.edu.my -from:ayuamirah.m@bac.edu.my -to:ayuamirah.m@bac.edu.my -from:azahari@faceberry.com.my -to:azahari@faceberry.com.my -from:azizul@iact.edu.my -to:azizul@iact.edu.my -from:azlina.s@veritas.edu.my -to:azlina.s@veritas.edu.my -from:azlina@iact.edu.my -to:azlina@iact.edu.my -from:azreen@iact.edu.my -to:azreen@iact.edu.my -from:azura.b@veritas.edu.my -to:azura.b@veritas.edu.my -from:azwan@iact.edu.my -to:azwan@iact.edu.my -from:balamurugan.p@bac.edu.my -to:balamurugan.p@bac.edu.my -from:brandon@bac.edu.my -to:brandon@bac.edu.my -from:brian@makeitrightmovement.com -to:brian@makeitrightmovement.com -from:charliechu@reliance.edu.my -to:charliechu@reliance.edu.my -from:charoen@iact.edu.my -to:charoen@iact.edu.my -from:chee.kin@bac.edu.my -to:chee.kin@bac.edu.my -from:chenghoe.c@bac.edu.my -to:chenghoe.c@bac.edu.my -from:chinkent.c@bac.edu.my -to:chinkent.c@bac.edu.my -from:cyrus.tan@iact.edu.my -to:cyrus.tan@iact.edu.my -from:darishani.r@bac.edu.my -to:darishani.r@bac.edu.my -from:david@bac.edu.my -to:david@bac.edu.my -from:Deepa@iact.edu.my -to:Deepa@iact.edu.my -from:dhevaania.g@veritas.edu.my -to:dhevaania.g@veritas.edu.my -from:dr.marygeorge@bac.edu.my -to:dr.marygeorge@bac.edu.my -from:elyena@iact.edu.my -to:elyena@iact.edu.my -from:emmy@iact.edu.my -to:emmy@iact.edu.my -from:ephesean.t@bac.edu.my -to:ephesean.t@bac.edu.my -from:eric.lim@bac.edu.my -to:eric.lim@bac.edu.my -from:ervina@iact.edu.my -to:ervina@iact.edu.my -from:esharry.r@bac.edu.my -to:esharry.r@bac.edu.my -from:farah@iact.edu.my -to:farah@iact.edu.my -from:fatin@iact.edu.my -to:fatin@iact.edu.my -from:fatinrosli@iact.edu.my -to:fatinrosli@iact.edu.my -from:fitriyah.z@bac.edu.my -to:fitriyah.z@bac.edu.my -from:ganeswari@bac.edu.my -to:ganeswari@bac.edu.my -from:gary.t@bac.edu.my -to:gary.t@bac.edu.my -from:gayathiri.v@bac.edu.my -to:gayathiri.v@bac.edu.my -from:gayathri.m@bac.edu.my -to:gayathri.m@bac.edu.my -from:geethannchali.s@bac.edu.my -to:geethannchali.s@bac.edu.my -from:govin@bac.edu.my -to:govin@bac.edu.my -from:gurjitsingh@bac.edu.my -to:gurjitsingh@bac.edu.my -from:hadri.o@bac.edu.my -to:hadri.o@bac.edu.my -from:hafiz@veritascollege.edu.my -to:hafiz@veritascollege.edu.my -from:halen.c@bac.edu.my -to:halen.c@bac.edu.my -from:hansini.t@bac.edu.my -to:hansini.t@bac.edu.my -from:hasliza@reliance.edu.my -to:hasliza@reliance.edu.my -from:hidayat.m@reliance.edu.my -to:hidayat.m@reliance.edu.my -from:hon.s@veritascollege.edu.my -to:hon.s@veritascollege.edu.my -from:hungying@iact.edu.my -to:hungying@iact.edu.my -from:IKE@bac.edu.my -to:IKE@bac.edu.my -from:iman.n@iact.edu.my -to:iman.n@iact.edu.my -from:imthiyaz@bac.edu.my -to:imthiyaz@bac.edu.my -from:intan@iact.edu.my -to:intan@iact.edu.my -from:irene.t@veritas.edu.my -to:irene.t@veritas.edu.my -from:iriscynthia.g@veritas.edu.my -to:iriscynthia.g@veritas.edu.my -from:irman.m@bac.edu.my -to:irman.m@bac.edu.my -from:Irwan@iact.edu.my -to:Irwan@iact.edu.my -from:isaac@reliance.edu.my -to:isaac@reliance.edu.my -from:ismalinda@iact.edu.my -to:ismalinda@iact.edu.my -from:izni.f@bac.edu.my -to:izni.f@bac.edu.my -from:jacinta@iact.edu.my -to:jacinta@iact.edu.my -from:Jaganraj@bac.edu.my -to:Jaganraj@bac.edu.my -from:janice.b@bac.edu.my -to:janice.b@bac.edu.my -from:Jason.c@veritascollege.edu.my -to:Jason.c@veritascollege.edu.my -from:jayne.l@bac.edu.my -to:jayne.l@bac.edu.my -from:jefvinder.j@bac.edu.my -to:jefvinder.j@bac.edu.my -from:jeremy.j@veritas.edu.my -to:jeremy.j@veritas.edu.my -from:jivaranee.n@veritas.edu.my -to:jivaranee.n@veritas.edu.my -from:johankondro@reliance.edu.my -to:johankondro@reliance.edu.my -from:joseph@iact.edu.my -to:joseph@iact.edu.my -from:julius.h@bac.edu.my -to:julius.h@bac.edu.my -from:kavitha@iact.edu.my -to:kavitha@iact.edu.my -from:kelvinhang.k@bac.edu.my -to:kelvinhang.k@bac.edu.my -from:kenneth@iact.edu.my -to:kenneth@iact.edu.my -from:kennethphilip.k@bac.edu.my -to:kennethphilip.k@bac.edu.my -from:Kent@reliance.edu.my -to:Kent@reliance.edu.my -from:ketheeswaran.p@bac.edu.my -to:ketheeswaran.p@bac.edu.my -from:khairul@iact.edu.my -to:khairul@iact.edu.my -from:khalidah@iact.edu.my -to:khalidah@iact.edu.my -from:kitei.wong@bac.edu.my -to:kitei.wong@bac.edu.my -from:lawrence@iact.edu.my -to:lawrence@iact.edu.my -from:leong@reliance.edu.my -to:leong@reliance.edu.my -from:lim.kw@reliance.edu.my -to:lim.kw@reliance.edu.my -from:loke.w@veritascollege.edu.my -to:loke.w@veritascollege.edu.my -from:luke@bac.edu.my -to:luke@bac.edu.my -from:mahalingam@reliance.edu.my -to:mahalingam@reliance.edu.my -from:mary@bac.edu.my -to:mary@bac.edu.my -from:mastura@reliance.edu.my -to:mastura@reliance.edu.my -from:meenaloshinee.m@bac.edu.my -to:meenaloshinee.m@bac.edu.my -from:Mekalah@iact.edu.my -to:Mekalah@iact.edu.my -from:mika.s@bac.edu.my -to:mika.s@bac.edu.my -from:muhammadazim.z@bac.edu.my -to:muhammadazim.z@bac.edu.my -from:munirah.m@bac.edu.my -to:munirah.m@bac.edu.my -from:nabila@iact.edu.my -to:nabila@iact.edu.my -from:nadia@iact.edu.my -to:nadia@iact.edu.my -from:nadirah.s@bac.edu.my -to:nadirah.s@bac.edu.my -from:nafisah.a@bac.edu.my -to:nafisah.a@bac.edu.my -from:nalini.c@veritas.edu.my -to:nalini.c@veritas.edu.my -from:nas@bac.edu.my -to:nas@bac.edu.my -from:natalie@iact.edu.my -to:natalie@iact.edu.my -from:naziranazari@bac.edu.my -to:naziranazari@bac.edu.my -from:nicholas.k@bac.edu.my -to:nicholas.k@bac.edu.my -from:nicola@iact.edu.my -to:nicola@iact.edu.my -from:nicole.p@bac.edu.my -to:nicole.p@bac.edu.my -from:nigel.gan@reliance.edu.my -to:nigel.gan@reliance.edu.my -from:nishallini@bac.edu.my -to:nishallini@bac.edu.my -from:noor@bac.edu.my -to:noor@bac.edu.my -from:noramirul.a@bac.edu.my -to:noramirul.a@bac.edu.my -from:norbaini.k@bac.edu.my -to:norbaini.k@bac.edu.my -from:norhasanah@iact.edu.my -to:norhasanah@iact.edu.my -from:norshahira.as@bac.edu.my -to:norshahira.as@bac.edu.my -from:nurainol.a@reliance.edu.my -to:nurainol.a@reliance.edu.my -from:nurfarahhanis.a@bac.edu.my -to:nurfarahhanis.a@bac.edu.my -from:nurliana_idaini@reliance.edu.my -to:nurliana_idaini@reliance.edu.my -from:nurulharnieza.a@bac.edu.my -to:nurulharnieza.a@bac.edu.my -from:nuruliffah.a@bac.edu.my -to:nuruliffah.a@bac.edu.my -from:parameswary.s@veritas.edu.my -to:parameswary.s@veritas.edu.my -from:parimalar.i@bac.edu.my -to:parimalar.i@bac.edu.my -from:pavitra.k@bac.edu.my -to:pavitra.k@bac.edu.my -from:predeep@bac.edu.my -to:predeep@bac.edu.my -from:R.Singham@bac.edu.my -to:R.Singham@bac.edu.my -from:rachel@iact.edu.my -to:rachel@iact.edu.my -from:radhi@iact.edu.my -to:radhi@iact.edu.my -from:rajasingham1000@gmail.com -to:rajasingham1000@gmail.com -from:registrar@reliance.edu.my -to:registrar@reliance.edu.my -from:renugadevi.a@bac.edu.my -to:renugadevi.a@bac.edu.my -from:rima.w@veritas.edu.my -to:rima.w@veritas.edu.my -from:rohaizat@iact.edu.my -to:rohaizat@iact.edu.my -from:rostheva@reliance.edu.my -to:rostheva@reliance.edu.my -from:rozita.s@bac.edu.my -to:rozita.s@bac.edu.my -from:sa@reliance.edu.my -to:sa@reliance.edu.my -from:sam.shubashini@bac.edu.my -to:sam.shubashini@bac.edu.my -from:satham.by@bac.edu.my -to:satham.by@bac.edu.my -from:shalini.m@veritas.edu.my -to:shalini.m@veritas.edu.my -from:shammalaa.r@bac.edu.my -to:shammalaa.r@bac.edu.my -from:shaqraz@makeitrightmovement.com -to:shaqraz@makeitrightmovement.com -from:sharasbok@iact.edu.my -to:sharasbok@iact.edu.my -from:sharifah.a@veritas.edu.my -to:sharifah.a@veritas.edu.my -from:sharmaine.s@bac.edu.my -to:sharmaine.s@bac.edu.my -from:sharon.p@bac.edu.my -to:sharon.p@bac.edu.my -from:shasthrika.b@bac.edu.my -to:shasthrika.b@bac.edu.my -from:shiuan.yap@iact.edu.my -to:shiuan.yap@iact.edu.my -from:shubashini.k@bac.edu.my -to:shubashini.k@bac.edu.my -from:sim.j@reliance.edu.my -to:sim.j@reliance.edu.my -from:sitifatunah@veritas.edu.my -to:sitifatunah@veritas.edu.my -from:stad@reliance.edu.my -to:stad@reliance.edu.my -from:suhan@makeitrightmovement.com -to:suhan@makeitrightmovement.com -from:syahiran.z@veritas.edu.my -to:syahiran.z@veritas.edu.my -from:syamimi@veritascollege.edu.my -to:syamimi@veritascollege.edu.my -from:tamilselvam.m@bac.edu.my -to:tamilselvam.m@bac.edu.my -from:tang.sc@reliance.edu.my -to:tang.sc@reliance.edu.my -from:teh.v@bac.edu.my -to:teh.v@bac.edu.my -from:tengkuadam.s@bac.edu.my -to:tengkuadam.s@bac.edu.my -from:thaddeus.g@bac.edu.my -to:thaddeus.g@bac.edu.my -from:tharshyini.m@bac.edu.my -to:tharshyini.m@bac.edu.my -from:tharunaganesh.r@bac.edu.my -to:tharunaganesh.r@bac.edu.my -from:thavanayagam@bac.edu.my -to:thavanayagam@bac.edu.my -from:thevaroobini@bac.edu.my -to:thevaroobini@bac.edu.my -from:thineshkumar@bac.edu.my -to:thineshkumar@bac.edu.my -from:timothy@iact.edu.my -to:timothy@iact.edu.my -from:vaani@reliance.edu.my -to:vaani@reliance.edu.my -from:valerie@makeitrightmovement.com -to:valerie@makeitrightmovement.com -from:venkata.v@veritas.edu.my -to:venkata.v@veritas.edu.my -from:vicky@iact.edu.my -to:vicky@iact.edu.my -from:vijayruben@bac.edu.my -to:vijayruben@bac.edu.my -from:vinod.j@bac.edu.my -to:vinod.j@bac.edu.my -from:waifun.c@bac.edu.my -to:waifun.c@bac.edu.my -from:wansiu.m@bac.edu.my -to:wansiu.m@bac.edu.my -from:yante@iact.edu.my -to:yante@iact.edu.my -from:yashotha.k@bac.edu.my -to:yashotha.k@bac.edu.my -from:yew.e@veritascollege.edu.my -to:yew.e@veritascollege.edu.my -from:yoges.achanah@reliance.edu.my -to:yoges.achanah@reliance.edu.my -from:zahir.z@bac.edu.my -to:zahir.z@bac.edu.my -from:charoen@bac.edu.my -to:charoen@bac.edu.my -from:haziq.h@bac.edu.my -to:haziq.h@bac.edu.my -from:damia.a@bac.edu.my -to:damia.a@bac.edu.my -from:irfan.e@bac.edu.my -to:irfan.e@bac.edu.my -from:prabawathi.r@bac.edu.my -to:prabawathi.r@bac.edu.my -from:anjanna.n@bac.edu.my -to:anjanna.n@bac.edu.my -from:sarjeen.t@bac.edu.my -to:sarjeen.t@bac.edu.my",
                pV2: "isread:no from:omprakash.p@bac.edu.my to:omprakash.p@bac.edu.my from:aria@bac.edu.my to:aria@bac.edu.my from:nadar@bac.edu.my to:nadar@bac.edu.my from:raymond@bac.edu.my to:raymond@bac.edu.my from:R.Singham@bac.edu.my to:R.Singham@bac.edu.my from:thillairaj.r@bac.edu.my to:thillairaj.r@bac.edu.my from:chandra@bac.edu.my to:chandra@bac.edu.my from:charoen@bac.edu.my to:charoen@bac.edu.my from:haziq.h@bac.edu.my to:haziq.h@bac.edu.my from:hafiz.i@bac.edu.my to:hafiz.i@bac.edu.my from:Julie@bac.edu.my to:Julie@bac.edu.my from:damia.a@bac.edu.my to:damia.a@bac.edu.my from:irfan.e@bac.edu.my to:irfan.e@bac.edu.my from:prabawathi.r@edu.my to:prabawathi.r@edu.my from:anjanna.n@bac.edu.my to:anjanna.n@bac.edu.my from:sarjeen.t@bac.edu.my to:sarjeen.t@bac.edu.my from:kavitha@bac.edu.my to:kavitha@bac.edu.my",
                mV2: "isread:no -from:omprakash.p@bac.edu.my -to:omprakash.p@bac.edu.my -from:aria@bac.edu.my -to:aria@bac.edu.my -from:nadar@bac.edu.my -to:nadar@bac.edu.my -from:raymond@bac.edu.my -to:raymond@bac.edu.my -from:R.Singham@bac.edu.my -to:R.Singham@bac.edu.my -from:thillairaj.r@bac.edu.my -to:thillairaj.r@bac.edu.my -from:chandra@bac.edu.my -to:chandra@bac.edu.my -from:charoen@bac.edu.my -to:charoen@bac.edu.my -from:haziq.h@bac.edu.my -to:haziq.h@bac.edu.my -from:hafiz.i@bac.edu.my -to:hafiz.i@bac.edu.my -from:Julie@bac.edu.my -to:Julie@bac.edu.my -from:damia.a@bac.edu.my -to:damia.a@bac.edu.my -from:irfan.e@bac.edu.my -to:irfan.e@bac.edu.my -from:prabawathi.r@edu.my -to:prabawathi.r@edu.my -from:anjanna.n@bac.edu.my -to:anjanna.n@bac.edu.my -from:sarjeen.t@bac.edu.my -to:sarjeen.t@bac.edu.my -from:kavitha@bac.edu.my -to:kavitha@bac.edu.my",
                pTeam: "isread:no from:mithila@bac.edu.my to:mithila@bac.edu.my from:ann.m@bac.edu.my to:ann.m@bac.edu.my from:kennethphilip.k@bac.edu.my to:kennethphilip.k@bac.edu.my from:jennifer@bac.edu.my to:jennifer@bac.edu.my from:shaun.tan@bac.edu.my to:shaun.tan@bac.edu.my from:riezman.r@bac.edu.my to:riezman.r@bac.edu.my from:carrot@bac.edu.my to:carrot@bac.edu.my from:Mike.f@bac.edu.my to:Mike.f@bac.edu.my from:ranjaniy@bac.edu.my to:ranjaniy@bac.edu.my from:kaarthic.m@bac.edu.my to:kaarthic.m@bac.edu.my from:jackie.u@bac.edu.my to:jackie.u@bac.edu.my from:komalavasan.t@bac.edu.my to:komalavasan.t@bac.edu.my from:a.jalalludin@bac.edu.my to:a.jalalludin@bac.edu.my from:balamurugan.p@bac.edu.my to:balamurugan.p@bac.edu.my from:jason.r@bac.edu.my to:jason.r@bac.edu.my from:haziq.h@bac.edu.my to:haziq.h@bac.edu.my from:kanesar@bac.edu.my to:kanesar@bac.edu.my from:gobinath@bac.edu.my to:gobinath@bac.edu.my from:sdteam@bac.edu.my to:sdteam@bac.edu.my to:omprakash.p@bac.edu.my",
                mTeam: "isread:no -from:mithila@bac.edu.my -to:mithila@bac.edu.my -from:ann.m@bac.edu.my -to:ann.m@bac.edu.my -from:kennethphilip.k@bac.edu.my -to:kennethphilip.k@bac.edu.my -from:jennifer@bac.edu.my -to:jennifer@bac.edu.my -from:shaun.tan@bac.edu.my -to:shaun.tan@bac.edu.my -from:riezman.r@bac.edu.my -to:riezman.r@bac.edu.my -from:carrot@bac.edu.my -to:carrot@bac.edu.my -from:Mike.f@bac.edu.my -to:Mike.f@bac.edu.my -from:ranjaniy@bac.edu.my -to:ranjaniy@bac.edu.my -from:kaarthic.m@bac.edu.my -to:kaarthic.m@bac.edu.my -from:jackie.u@bac.edu.my -to:jackie.u@bac.edu.my -from:komalavasan.t@bac.edu.my -to:komalavasan.t@bac.edu.my -from:a.jalalludin@bac.edu.my -to:a.jalalludin@bac.edu.my -from:balamurugan.p@bac.edu.my -to:balamurugan.p@bac.edu.my -from:jason.r@bac.edu.my -to:jason.r@bac.edu.my -from:haziq.h@bac.edu.my -to:haziq.h@bac.edu.my -from:kanesar@bac.edu.my -to:kanesar@bac.edu.my -from:gobinath@bac.edu.my -to:gobinath@bac.edu.my -from:sdteam@bac.edu.my -to:sdteam@bac.edu.my -to:omprakash.p@bac.edu.my",
                m: "from:mithila@bac.edu.my",
                a: "from:ann.m@bac.edu.my",
                ken: "from:kennethphilip.k@bac.edu.my",
                jen: "from:jennifer@bac.edu.my",
                s: "from:shaun.tan@bac.edu.my",
                r: "from:riezman.r@bac.edu.my",
                c: "from:carrot@bac.edu.my",
                mik: "from:Mike.f@bac.edu.my",
                jin: "from:ranjaniy@bac.edu.my",
                kaa: "from:kaarthic.m@bac.edu.my",
                jac: "from:jackie.u@bac.edu.my",
                vas: "from:komalavasan.t@bac.edu.my",
                qa: "from:a.jalalludin@bac.edu.my",
                b: "from:balamurugan.p@bac.edu.my",
                js: "from:jason.r@bac.edu.my",
                haz: "from:haziq.h@bac.edu.my",
                kan: "from:kanesar@bac.edu.my",
                gob: "from:gobinath@bac.edu.my",
                tsd: "to:sdteam@bac.edu.my",
                fsd: "from:sdteam@bac.edu.my",
                o: "to:omprakash.p@bac.edu.my",
            };
        },
        add_li_filter_email_by: function () {
            let that = this;
            let full_list = "";
            let filter_string = document.createElement("li");
            let emails = that.get_email_from_filter_by();

            for (const name in emails) {
                const wrapper = document.createElement("a");
                wrapper.textContent = name;
                wrapper.href = "#";
                wrapper.classList.add("helper-filter-email-by", "helper-btn");

                wrapper.addEventListener("click", function (event) {
                    event.preventDefault();
                    const mail_address = document.createElement("div");
                    mail_address.textContent = `${emails[name].toLowerCase()}`;
                    if (
                        name === "pAll" ||
                        name === "mAll" ||
                        name === "pV2" ||
                        name === "mV2" ||
                        name === "pTeam" ||
                        name === "mTeam"
                    ) {
                        let today_filter = that.get_today_email_filter_text();
                        mail_address.textContent =
                            `${today_filter.textContent} ${mail_address.textContent}`.trim();
                    }
                    that.copy_to_clipboard(mail_address, wrapper);
                });
                filter_string.appendChild(wrapper);
                full_list = `${full_list} ${emails[name].toLowerCase()}`.trim();
            }
            filter_string.setAttribute(
                "style",
                "display: grid;grid-template-columns: repeat(6, 40px);"
            );
            this.append_to_parent(filter_string);
        },
        add_li_filter_today_email: function () {
            let that = this;
            let class_btn = ".helper-filter-for-today-email";

            let filter_string = document.createElement("li");
            filter_string.innerHTML = `<div class="tools">
                                            <a class="${class_btn.slice(
                                                1
                                            )} helper-btn" href="#">今天的电子邮件过滤器</a>
                                        </div>`;
            this.append_to_parent(filter_string);

            const helper_btn = document.querySelector(class_btn);
            helper_btn.addEventListener("click", function (event) {
                event.preventDefault();
                that.copy_to_clipboard(
                    that.get_today_email_filter_text(),
                    helper_btn
                );
            });
        },
        add_li_filter_LP_requirement: function () {
            let that = this;
            let li_item = document.createElement("li");
            let lp_requirement = document.createElement("div");
            lp_requirement.innerHTML = `Kindly advise us the following information's that you need for this LP:
<ol>
    <li><strong>Kindly provide the Mobile view page design. (Check Design is PROVIDED or NOT)</strong></li>
    <li>Which site to build the LP?
        <ul>
            <li><i>eg: bac.edu.my ?</i></li>
        </ul>
    </li>
    <li>
        The LP's final link to use?
        <ul>
            <li><i>eg: bac.edu.my/link-name ?</i></li>
        </ul>
    </li>
    <li>
        Connect to NCC?
        <ul>
            <li><i>eg: Yes/No ?</i></li>
        </ul>
    </li>
    <li>
        Connect to Data Warehouse?
        <ul>
            <li><i>eg: Yes/No ?</i></li>
        </ul>
    </li>
    <li>
        Connect to Dynamics?
        <ul>
            <li><i>eg: Yes/No ?</i></li> &lt;BY DEFAULT: Connect to DYNAMICS is YES - if its OPEN DAY LP&gt; check official email from Mithila
        </ul>
    </li>
    <li>
        Add Google Ads Conversion?
        <ul>
            <li><i>eg: Yes/No ?</i></li>
        </ul>
    </li>
    <li>
        Add FB Conversion Tracking?
        <ul>
            <li><i>eg: Yes/No ?</i></li>
        </ul>
    </li>
    <li>
        List of Email Recipient(s)?
        <ul>
            <li>?</li>
        </ul>
    </li>
    <li>
        Auto Responder Message?
        <ul>
            <li>if Yes, kindly provide the message to use.</li>
        </ul>
    </li>
    <li>Add Event banner image?
        <ul>
            <li><i>eg: Yes/No ?</i></li>
        </ul>
    </li>
    <li>Add Marketing Links?
        <ul>
            <li><i>eg: Yes/No ?</i></li>
        </ul>
    </li>
    <li>Add Short Links?
        <ul>
            <li>If Yes, kindly provide the short link name to use.</li>
        </ul>
    </li>
    <li>Is this event open for the public to join?
        <ul>
            <li><i>eg: Yes/No ?</i></li>
        </ul>
    </li>
</ol>

<p><em>Please Confirm the UTM Sources for ML &amp; SL</em></p>
 <table cellspacing="0" style="border-collapse:collapse;">
	<tbody>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; vertical-align:bottom; white-space:nowrap; width:77px"><span style="font-size:15px"><span style="color:black"><strong><span>To Include?</span></strong></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><strong><span>Source</span></strong></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><strong><span>Medium</span></strong></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>google</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>rsa</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>meta</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>rsa</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>google</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ads</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>meta</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ads</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>tiktok</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ads</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ym</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>int</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>rs</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>int</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>rswa</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>int</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>sc</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>int</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>linkedin</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ads</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>lrs</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>int</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>collateral</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>-</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ncc</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ec</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ym</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>students</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ncc</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>students</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>departmental</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>whatsapp</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>tgv</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>cads</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>lms</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>students</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ym</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>alumni</span></span></span></td>
		</tr>
		<tr>
			<td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:nowrap"><span style="font-size:15px"><span style="color:black"><span>Yes/No</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>ncc</span></span></span></td>
			<td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal;"><span style="font-size:13px"><span style="color:black"><span>alumni</span></span></span></td>
		</tr>
	</tbody>
</table>
`;
            const btnWrapper = document.createElement("div");
            btnWrapper.classList.add("tools");

            const anchor = document.createElement("a");
            anchor.textContent = "LPR";
            anchor.classList.add("helper-filter-lp-requirement", "helper-btn");
            anchor.addEventListener("click", function (event) {
                event.preventDefault();
                that.copy_to_clipboard(lp_requirement, anchor);
            });
            btnWrapper.appendChild(anchor);
            li_item.appendChild(btnWrapper);
            this.append_to_parent(li_item);
        },
        add_li_resize_img: function () {
            let that = this;
            let class_btn = ".helper-filter-for-img-resize";

            const run_img_resize = async function () {
                let newWidth = 110;
                let editor = ".dMm6A .yz4r1.Jt4w1.dnzWM > div"; // ".dMm6A.AiSsJ .yz4r1.Jt4w1.dnzWM > div"
                const editor_elem = document.querySelector(editor);

                if (editor_elem) {
                    const imgElements = editor_elem.querySelectorAll("img");

                    if (imgElements.length) {
                        // Use `Promise.all` to handle asynchronous image loading
                        await Promise.all(
                            Array.from(imgElements).map(async (img) => {
                                const originalSrc = img.getAttribute("src");
                                const newImg = new Image();
                                newImg.src = originalSrc;

                                await new Promise((resolve) => {
                                    newImg.onload = () => {
                                        const originalWidth = newImg.width;
                                        const originalHeight = newImg.height;
                                        if (
                                            originalWidth === 1600 ||
                                            originalWidth === 2400
                                        ) {
                                            newWidth = 230;
                                        }
                                        const aspectRatio =
                                            originalWidth / originalHeight;
                                        const newHeight = Math.round(
                                            newWidth / aspectRatio
                                        );

                                        // Modify the img element in the cloned DOM
                                        img.setAttribute(
                                            "style",
                                            `max-width:100%; width:${newWidth}px; height:${newHeight}px;`
                                        );
                                        img.setAttribute("width", newWidth); //   The width and height attributes always define the width and height of the image in pixels.
                                        img.setAttribute("height", newHeight); // The width and height attributes always define the width and height of the image in pixels.

                                        resolve(); // Resolve the promise after image resizing
                                    };
                                });
                            })
                        );
                    }
                }
            };

            let resize_img = document.createElement("li");
            resize_img.innerHTML = `<div class="tools">
                                            <a class="${class_btn.slice(
                                                1
                                            )} helper-btn" href="#">改尺寸</a>
                                        </div>`;
            this.append_to_parent(resize_img);

            const helper_btn = document.querySelector(class_btn);
            helper_btn.addEventListener("click", (event) => {
                event.preventDefault();
                run_img_resize();
            });
        },
        close_pg_table_by_spacebar: function () {
            document.addEventListener("keydown", (event) => {
                if (
                    event.code === "Space" &&
                    this.hamburger_keypress_state === false
                ) {
                    event.preventDefault();
                    document.removeEventListener(
                        "keydown",
                        this.close_pg_table_by_spacebar
                    );
                    document.getElementById("hamburger")?.click();
                    this.hamburger_keypress_state = true;
                }
            });
        },
        verify_valid_selectors: function () {
            const body = document.body;

            const tooltip = document.createElement("div");
            tooltip.setAttribute("id", "verify-selector-info");

            const style = document.createElement("style");
            style.setAttribute("class", "selector-verification-infobox-style");
            style.textContent = `
#verify-selector-info {
    display: none;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}
#verify-selector-info.show {
    display: block;
    opacity: 1;
}`;

            body.appendChild(tooltip);
            body.appendChild(style);

            const validate_selector = (input) => {
                if (!input || input.trim() === "") {
                    return [];
                }
                const potentialSelectors = input.split(",");
                const valid_selectors = [];
                for (const selector of potentialSelectors) {
                    try {
                        if (
                            document.querySelectorAll(selector.trim()).length >
                            0
                        ) {
                            valid_selectors.push(selector.trim());
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                return valid_selectors;
            };

            let that = this;
            let class_btn = ".helper-verify-elem-selector";

            let filter_string = document.createElement("li");
            filter_string.innerHTML = `<div class="tools">
                                            <a class="${class_btn.slice(
                                                1
                                            )} helper-btn" href="#">Verify Selector</a>
                                        </div>`;
            this.append_to_parent(filter_string);

            const helper_btn = document.querySelector(class_btn);
            helper_btn.addEventListener("click", function (event) {
                event.preventDefault();

                const input = prompt("Enter CSS selectors (comma-separated):");
                const selectors = validate_selector(input);
                if (selectors.length > 0) {
                    tooltip.textContent =
                        "Valid selectors: " + selectors.join(", ");
                    selectors.forEach((elem) => {
                        document
                            .querySelector(elem)
                            .style.setProperty("outline", "solid 5px yellow");
                    });
                } else {
                    tooltip.textContent = "No valid selectors found";
                }

                tooltip.classList.add("show");
                setTimeout(() => {
                    tooltip.classList.remove("show");
                    selectors &&
                        selectors.forEach((elem) => {
                            document
                                .querySelector(elem)
                                .style.removeProperty("outline");
                        });
                }, 3000); // Fade out after 3 seconds
            });
        },
        add_college_institute_urls: function() {
            let that = this;
            let li_item = document.createElement("li");
            let btnWrapper = document.createElement("div");
            btnWrapper.classList.add("tools");

            const addCopyBtn = (btnName, btnContent, btnClass) => {
                const anchor = document.createElement("a");
                anchor.textContent = btnName;
                anchor.classList.add(`helper-${btnClass}`, "helper-btn");
                anchor.addEventListener("click", event => {
                    event.preventDefault();
                    that.copy_to_clipboard(btnContent, anchor);
                });
                btnWrapper.appendChild(anchor);
            };

            addCopyBtn("PHEI",
                `https://www.bac.edu.my/
https://www.baccollege.edu.my/
https://www.bac.edu.sg/
https://www.veritas.edu.my/
https://www.unimy.edu.my/
https://www.iact.edu.my/
https://www.reliance.edu.my/
https://www.courseadvisor.asia/
https://www.hrdacademy.asia/
https://www.giveback.my/`,
                "copy-phei-homepage");

            addCopyBtn("WP-Admin",
                `https://www.bac.edu.my/wp-admin/
https://www.baccollege.edu.my/wp-admin/
https://www.bac.edu.sg/wp-admin/
https://www.veritas.edu.my/wp-admin/
https://www.unimy.edu.my/wp-admin/
https://www.iact.edu.my/wp-admin/
https://www.reliance.edu.my/wp-admin/
https://www.courseadvisor.asia/wp-admin/
https://www.hrdacademy.asia/wp-admin/
https://www.giveback.my/wp-admin/`,
                "copy-phei-wp-admin"
            );

            addCopyBtn("Plugin",
                `https://www.bac.edu.my/wp-admin/plugins.php
https://www.baccollege.edu.my/wp-admin/plugins.php
https://www.bac.edu.sg/wp-admin/plugins.php
https://www.veritas.edu.my/wp-admin/plugins.php
https://www.unimy.edu.my/wp-admin/plugins.php
https://www.iact.edu.my/wp-admin/plugins.php
https://www.reliance.edu.my/wp-admin/plugins.php
https://www.courseadvisor.asia/wp-admin/plugins.php
https://www.hrdacademy.asia/wp-admin/plugins.php
https://www.giveback.my/wp-admin/plugins.php`,
                "copy-phei-plugin"
            );

            addCopyBtn(
                "Functions",
                `https://www.bac.edu.my/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child
https://www.baccollege.edu.my/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child
https://www.bac.edu.sg/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child
https://www.veritas.edu.my/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child
https://www.unimy.edu.my/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child
https://www.iact.edu.my/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child
https://www.reliance.edu.my/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child
https://www.courseadvisor.asia/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child
https://www.hrdacademy.asia/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child
https://www.giveback.my/wp-admin/theme-editor.php?file=functions.php&theme=essentials-child`,
                "copy-phei-child-theme"
            );

            li_item.appendChild(btnWrapper);
            this.append_to_parent(li_item);
        },
        init: function () {
            // DOMContentLoaded does not work for this code
            window.addEventListener("load", () => {
                // arrow function to use this context in this function
                try {
                    // Debug: Check what's available
                    console.log("GSAP available:", typeof gsap);
                    console.log("Draggable available:", typeof Draggable);
                    console.log("domtoimage available:", typeof domtoimage);

                    // Safety check
                    if (typeof domtoimage === "undefined") {
                        console.error("domtoimage not loaded! Check:");
                        console.error("1. File exists in libs/ folder");
                        console.error(
                            "2. manifest.json includes it in content_scripts"
                        );
                        console.error(
                            "3. No errors in chrome://extensions console"
                        );
                        return;
                    }

                    this.create_helper_menu_element(
                        "om-outlook-helper",
                        "-200px",
                        "0px",
                        0.5
                    );

                    this.add_li_daily_report_title();
                    this.add_li_filter_today_email();
                    this.add_li_filter_LP_requirement();
                    this.add_li_filter_email_by();
                    // this.add_li_form_test_table();
                    this.verify_valid_selectors();
                    this.add_li_resize_img();
                    Draggable.create("#hamburger", {
                        bounds: document.getElementsByTagName("body")[0],
                    });
                    this.close_pg_table_by_spacebar();

                    // use arrow function to preserve outer context for `this`
                    setTimeout(() => {
                        this.add_li_copy_email_btn();
                        this.add_li_copy_email_body_with_subject_btn();
                        this.add_college_institute_urls();
                    }, 1000);
                } catch (error) {
                    console.error("DOM-to-image conversion failed:", error);
                }
            });
        },
    };
    report_helper.init();
})();