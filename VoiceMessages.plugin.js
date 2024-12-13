/**
 * @name VoiceMessages
 * @version 0.0.1
 * @author UnStackss
 * @authorId 1131965612890005626
 * @website https://github.com/UnStackss
 * @source https://github.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/tree/master
 * @updateUrl https://raw.githubusercontent.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/master/VoiceMessages.plugin.js
 * @invite NPa6DtPtMU
 */
module.exports = (() => {
  const config = {
    info: {
      name: "VoiceMessages",
      authors: [
        {
          name: "UnStackss",
          discord_id: "1131965612890005626",
          github_username: "UnStackss",
        },
      ],
      version: "0.0.1",
      description:
        "🔊 Quickly send voice messages directly in Discord! 🎤 With this plugin, you can easily record and send voice messages right to your channel. Simply press F12 to start recording and press it again to stop and send your message. Perfect for sharing updates, ideas, or just communicating more expressively with friends and your community! 🚀",
      github:
        "https://github.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/tree/master",
      github_raw:
        "https://raw.githubusercontent.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/master/VoiceMessages.plugin.js",
    },
    changelog: [
      {
        title: "🎙️ Send Voice Messages!",
        items: [
          "Now you can send voice messages effortlessly! 🎉",
          "Press F12 to start recording, and press it again to stop and send your message! 🚀",
        ],
      },
    ],
  };

  return !global.ZeresPluginLibrary
    ? class {
        constructor() {
          this._config = config;
        }
        getName() {
          return config.info.name;
        }
        getAuthor() {
          return config.info.authors.map((a) => a.name).join(", ");
        }
        getDescription() {
          return config.info.description;
        }
        getVersion() {
          return config.info.version;
        }
        load() {
          BdApi.showConfirmationModal(
            "Library Missing",
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
              confirmText: "Download Now",
              cancelText: "Cancel",
              onConfirm: () => {
                const fileUrl =
                  "https://raw.githubusercontent.com/zerebos/BDPluginLibrary/3f321f9a3b21f3829277870068b98673ffd5c869/release/0PluginLibrary.plugin.js";
                const filePath = require("path").join(
                  BdApi.Plugins.folder,
                  "0PluginLibrary.plugin.js"
                );

                BdApi.Net.fetch(fileUrl, { method: "GET" })
                  .then((response) => {
                    if (!response.ok) {
                      BdApi.showToast(
                        "Failed to download plugin. Please try again.",
                        { type: "error", icon: "⚠️" }
                      );
                      throw new Error("Network response was not ok.");
                    }
                    return response.text();
                  })
                  .then((data) => {
                    require("fs").writeFile(filePath, data, (err) => {
                      if (err) {
                        BdApi.showToast(
                          "Error occurred. Failed to save plugin.",
                          { type: "error", icon: "⚠️" }
                        );
                      } else {
                        BdApi.showToast("Plugin downloaded successfully!", {
                          type: "success",
                          icon: "ℹ️",
                        });
                      }
                    });
                  })
                  .catch((error) => {
                    BdApi.showToast(
                      "Error occurred. Opening the file in browser.",
                      { type: "warning", icon: "⚠️" }
                    );
                    require("electron").shell.openExternal(fileUrl);
                  });
              },
            }
          );
        }
        start() {}
        stop() {}
      }
    : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
          const { WebpackModules } = Library;

          ("use strict");

          var discordVoice =
            DiscordNative.nativeModules.requireModule("discord_voice");

          class record {
            static start = function (options) {
              const settings = BdApi.getData("VoiceMessages", "settings") || {};
              const { echoCancellation = true, noiseCancellation = true } =
                settings;

              discordVoice.startLocalAudioRecording(
                {
                  echoCancellation: echoCancellation,
                  noiseCancellation: noiseCancellation,
                },
                (success) => {
                  if (success) {
                    console.log("🎙️ Recording has started!");
                    BdApi.showToast("🎙️ Recording started successfully!", {
                      type: "success",
                      icon: "ℹ️",
                    });
                  } else {
                    BdApi.showToast(
                      "❌ Failed to start recording. Please try again!",
                      {
                        type: "error",
                        icon: "⚠️",
                      }
                    );
                  }
                }
              );
            };

            static stop = function () {
              const settings = BdApi.getData("VoiceMessages", "settings") || {};
              const useRandomFilename = settings.useRandomFilename || false;
              const staticFilename = settings.filename || "Recording";
              const format = settings.format || "ogg";

              discordVoice.stopLocalAudioRecording((filePath) => {
                if (filePath) {
                  try {
                    require("fs").readFile(filePath, {}, (err, buf) => {
                      if (buf) {
                        const filename = useRandomFilename
                          ? this.generateRandomFileName()
                          : staticFilename;

                        WebpackModules.getByProps(
                          "instantBatchUpload",
                          "upload"
                        ).instantBatchUpload({
                          channelId: channel.getChannelId(),
                          files: [
                            new File(
                              [
                                new Blob([buf], {
                                  type: `audio/${format}; codecs=opus`,
                                }),
                              ],
                              `${filename}.${format}`,
                              { type: `audio/${format}; codecs=opus` }
                            ),
                          ],
                        });
                      } else {
                        BdApi.showToast("Failed to finish recording", {
                          type: "error",
                          icon: "⚠️",
                        });
                      }
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }
                console.log("RECORDING STOPPED! 🎤");
              });
            };

            static generateRandomFileName = function () {
              const names = [
                "PixelPurr😺",
                "FuzzyFling🦄",
                "ChirpChomp🐦",
                "BlipBop🎉",
                "DoodlePop🧚‍♀️",
                "SizzleSnap🔥",
                "GlimmerGlow🌟",
                "SqueakZoom🐭",
                "FizzFizz💧",
                "BuzzBop💥",
                "ZapZap⚡",
                "TwinkleTee✨",
                "SparkleSwoosh💫",
                "TwangTee🎵",
                "QuirkyQuip🤪",
                "ChirpBing🐣",
                "PopFizz🍾",
                "DoodleBloop🌀",
                "GlimmerPop💎",
                "SqueakZap⚡️",
                "TwistyTing🎠",
                "SnappySparkle✨",
                "WhisperWiz🌌",
                "GlitzyGlimpse💫",
                "FuzzyFizz🐼",
                "BubblyBuzz💧",
                "SlickSizzle🔥",
                "QuirkyChirp🐦",
                "DazzleGlow🌟",
                "GlimmerSnap✨",
                "WhisperTing🕊️",
                "PopFizz🎈",
                "SqueakySnap🐭",
                "FizzFizz💦",
                "BuzzBling💎",
                "TwinklePop🌠",
                "DoodleSwoosh🌌",
                "SnapSparkle🌟",
                "BlingBop💥",
                "WhisperFizz✨",
                "GlimmerTee🎵",
                "SizzleBling🔥",
                "PopBling💫",
                "TwistySwoosh🎠",
                "WhisperSparkle🌌",
                "GlitzyChirp🐦",
                "FizzBling💧",
                "BuzzPop💥",
                "SlickTing🔥",
                "QuirkyBop🤪",
                "ChirpSizzle🐦",
                "TwistBling🎠",
                "DoodlePop💎",
                "GlimmerSwoosh✨",
                "SnapBuzz💧",
                "WhisperPop🌌",
                "FizzTing💦",
                "BuzzSnap💥",
                "SizzleChirp🔥",
                "TwistSwoosh🎠",
                "PopFizz✨",
                "GlimmerBop💎",
                "ChirpTing🐦",
                "WhisperSwoosh🌌",
                "TwistPop🎠",
                "DoodleSnap💫",
                "SizzleFling🔥",
                "BuzzBling💥",
                "TwistBop🎠",
                "GlimmerFizz✨",
                "PopTing💦",
                "SlickSnap🔥",
                "BlingChirp💎",
                "WhisperBling🌌",
                "DoodleFling🌀",
                "FizzBuzz💦",
                "TwistBling🎠",
                "PopSizzle💥",
                "ChirpBling🐦",
                "GlimmerSwoosh✨",
                "FizzPop💧",
                "TwistSnap🎠",
                "BlingSizzle💫",
                "WhisperFizz🌌",
                "DoodleBop💫",
                "FizzBop💦",
                "GlimmerFling💎",
                "SizzlePop🔥",
                "TwistTee🎠",
                "WhisperSnap🌌",
                "PopFizz💥",
                "BlingSwoosh💫",
                "ChirpTee🐦",
                "TwistBling🎠",
                "DoodleSnap💫",
                "GlitterBuzz💫",
                "SqueakBling🐭",
                "BuzzFizz💥",
                "ChirpDazzle🐦",
                "TwistFizz🎠",
                "DoodleBling🌀",
                "SparkleChirp💫",
                "PopSnap💧",
                "FizzChirp💦",
                "BlingSwoosh🎠",
                "SizzlePop💥",
                "TwistBuzz🔥",
                "DoodleFizz🌀",
                "ChirpTing🐦",
                "SlickBling🔥",
                "WhisperPop🌌",
                "BuzzSwoosh💥",
                "GlimmerChirp💎",
                "FizzSnap💦",
                "BlingTwist🎠",
                "DoodleBling💎",
                "SizzleChirp🐦",
                "BuzzFizz💦",
                "PopSparkle💫",
                "TwistFizz🎠",
                "ChirpSizzle🐦",
                "FizzBop💧",
                "DoodleBling🌀",
                "WhisperBuzz🌌",
                "SizzleFizz🔥",
                "BuzzChirp💥",
                "TwistBop🎠",
                "GlimmerFizz💎",
                "SlickFizz🔥",
                "PopTwist🎈",
                "DoodleBuzz🌀",
                "FizzSnap💦",
                "ChirpPop🐦",
                "TwistBling🎠",
                "SizzleBuzz🔥",
                "GlimmerBling💎",
                "PopSizzle💥",
                "WhisperFling🌌",
                "BuzzFizz💥",
                "DoodleChirp🌀",
                "FizzPop💧",
                "TwistSnap🎠",
                "SizzleBling🔥",
                "WhisperBop🌌",
                "BuzzFizz💦",
                "ChirpTwist🐦",
                "DoodleFizz🌀",
                "SizzleFizz🔥",
                "FizzBop💧",
                "GlimmerBling💎",
                "BuzzSnap💥",
                "PopChirp🎈",
                "TwistSizzle🎠",
                "WhisperSnap🌌",
                "FizzBuzz💦",
                "DoodleChirp💫",
                "SizzleFizz🔥",
                "ChirpBling🐦",
                "PopFizz💥",
                "BuzzFizz💦",
                "FizzBop💧",
                "TwistFizz🎠",
                "GlimmerFizz💎",
                "WhisperBuzz🌌",
                "SizzleBling🔥",
                "DoodleSnap🌀",
                "FizzPop💧",
                "ChirpFizz🐦",
                "TwistBuzz🎠",
                "SizzleBling🔥",
                "PopSnap💥",
                "FizzChirp💦",
                "BuzzBling💥",
                "DoodleFizz🌀",
                "WhisperFizz🌌",
              ];
              return names[Math.floor(Math.random() * names.length)];
            };
          }

          var recording = true;

          const { showToast } = BdApi;
          const channel = BdApi.findModuleByProps("getLastSelectedChannelId");

          function toggleRecording() {
            if (recording === true) {
              record.start();
              recording = false;
            } else {
              record.stop();
              recording = true;
              console.log("STOPPED RECORDING");
              showToast("🛑 Recording stopped!", {
                type: "info",
                icon: "ℹ️",
              });
            }
          }

          startFunc = function (event) {
            const settings = BdApi.getData("VoiceMessages", "settings") || {};
            const keybind = settings.keybind || "F12";

            if (event.key === keybind) {
              toggleRecording();
              event.preventDefault();
            }
          };

          return class VoiceMessages extends Plugin {
            constructor() {
              super();
              this.active = true;
            }

            onStart() {
              ZLibrary.PluginUpdater.checkForUpdate(
                this.getName(),
                this.getVersion(),
                "https://raw.githubusercontent.com/UnStackss/Voice-Messages-Plugin-BetterDiscord/master/VoiceMessages.plugin.js"
              );
              document.addEventListener("keydown", startFunc);
            }

            onStop() {
              document.removeEventListener("keydown", startFunc);
              this.active = false;
            }

            getSettingsPanel() {
              const settingsPanel = document.createElement("div");
              settingsPanel.classList.add("settings-panel");
              settingsPanel.innerHTML = `
                <style>
                  .settings-panel {
                    background-color: #121212;
                    color: #E0E0E0;
                    padding: 20px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
                    font-family: 'Roboto', sans-serif;
                  }

                  .feature-card {
                    background-color: #1E1E1E;
                    border: 1px solid #333;
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 15px;
                    text-align: center;
                    width: 90%;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
                    transition: box-shadow 0.3s, transform 0.3s;
                  }

                  .feature-card:hover {
                    box-shadow: 0px 4px 8px rgba(59, 130, 246, 0.8);
                    transform: translateY(-5px);
                  }

                  .feature-card.disabled {
                    filter: blur(3px);
                    pointer-events: none;
                  }

                  .feature-card h3 {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #3b82f6;
                    margin-bottom: 10px;
                  }

                  .feature-card p {
                    font-size: 1em;
                    line-height: 1.6;
                    color: #B0B0B0;
                  }

                  .settings-input {
                    margin-top: 10px;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid #333;
                    background-color: #1E1E1E;
                    color: #FFF;
                    outline: none;
                    font-size: 1em;
                    width: calc(100% - 20px);
                    transition: box-shadow 0.3s;
                  }

                  .settings-input:hover {
                    box-shadow: 0px 0px 8px rgba(59, 130, 246, 0.8);
                  }

                  .save-button {
                    background-color: #3b82f6;
                    color: #FFF;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1em;
                    margin-top: 20px;
                    transition: background-color 0.3s, box-shadow 0.3s;
                  }

                  .save-button:hover {
                    background-color: #2563eb;
                    box-shadow: 0px 4px 8px rgba(59, 130, 246, 0.8);
                  }

                  .hidden {
                    display: none;
                  }

                  .custom-radio {
                    appearance: none;
                    background-color: #1E1E1E;
                    margin: 0;
                    font: inherit;
                    width: 1.5em;
                    height: 1.5em;
                    border: 2px solid #333;
                    border-radius: 0.5em;
                    display: grid;
                    place-content: center;
                    cursor: pointer;
                    outline: none;
                    transition: border 0.3s, background-color 0.3s, transform 0.2s ease-in-out;
                    position: relative;
                  }

                  .custom-radio::before {
                    content: '';
                    width: 0.8em;
                    height: 0.8em;
                    background-color: transparent;
                    clip-path: polygon(14% 44%, 0% 63%, 50% 100%, 100% 0%, 85% 0%, 43% 78%);
                    transition: background-color 0.3s, transform 0.2s ease-in-out;
                    transform: scale(0);
                  }

                  .custom-radio:checked {
                    border: 2px solid #3b82f6;
                    background-color: #3b82f6;
                    transform: scale(1.1);
                  }

                  .custom-radio:checked::before {
                    background-color: #ffffff;
                    transform: scale(1);
                  }

                  .custom-radio:focus {
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
                  }

                  .custom-radio-label {
                    margin-left: 10px;
                    color: #B0B0B0;
                    font-size: 1em;
                  }

                  .custom-switch {
            display: flex;
            align-items: center;
        }

        .custom-switch input {
            position: relative;
            appearance: none;
            width: 40px;
            height: 20px;
            background-color: #333;
            border-radius: 20px;
            cursor: pointer;
            outline: none;
            transition: background-color 0.3s ease;
        }

        .custom-switch input:checked {
            background-color: #3b82f6;
        }

        .custom-switch input::before {
            content: '';
            position: absolute;
            top: 1px;
            left: 2px;
            width: 18px;
            height: 18px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s ease;
            transform: translateX(0);
        }

        .custom-switch input:checked::before {
            transform: translateX(20px);
        }
                </style>
                <section class="feature-section">
                   <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
            <label class="custom-switch" style="display: flex; align-items: center; gap: 10px;">
                <span style="color: #B0B0B0; font-size: 1em;">🚀 Send as Real Voice Message</span>
                <input type="checkbox" id="realVoiceMessageToggle" class="settings-input" style="appearance: none; width: 40px; height: 20px; background-color: #333; border-radius: 20px; position: relative; cursor: pointer; outline: none; transition: background-color 0.3s ease;">
                <span style="content: ''; position: absolute; width: 18px; height: 18px; background-color: white; border-radius: 50%; transition: transform 0.3s ease; transform: translateX(2px);"></span>
                <input type="checkbox" id="realVoiceMessageToggle" class="settings-input" style="appearance: none; width: 40px; height: 20px; background-color: #333; border-radius: 20px; position: relative; cursor: pointer; outline: none; transition: background-color 0.3s ease;">
                <span style="content: ''; position: absolute; width: 18px; height: 18px; background-color: white; border-radius: 50%; transition: transform 0.3s ease; transform: translateX(2px);"></span>
            </label>
        </div>
                  <div class="feature-card" id="keybindCard">
                    <h3>⌨️ Keybind</h3>
                    <p>Set your preferred keybind for starting/stopping recording:</p>
                    <input type="text" class="settings-input" id="keybindInput" placeholder="Enter keybind (e.g., F12)">
                  </div>
                  <div class="feature-card" id="filenameCard">
                    <h3>📁 Filename Format</h3>
                    <p>Choose between static or random filename:</p>
                    <div style="margin-top: 10px; display: flex; align-items: center;">
                      <input type="radio" id="randomName" name="filenameOption" value="random" class="custom-radio" checked>
                      <label for="randomName" class="custom-radio-label">Random Name</label>
                      <input type="radio" id="staticName" name="filenameOption" value="static" class="custom-radio" style="margin-left: 20px;">
                      <label for="staticName" class="custom-radio-label">Static Name</label>
                    </div>
                    <input type="text" class="settings-input hidden" id="filenameInput" placeholder="Enter filename">
                  </div>
                  <div class="feature-card" id="formatCard">
                    <h3>🎙️ Audio Format</h3>
                    <p>Select the desired audio format:</p>
                    <select class="settings-input" id="formatInput">
                      <option value="ogg" selected>.ogg</option>
                      <option value="mp3">.mp3</option>
                      <option value="wav">.wav</option>
                    </select>
                  </div>
                </section>
                <button class="save-button" id="saveSettings">Save Settings</button>
              `;

              const keybindInput = settingsPanel.querySelector("#keybindInput");
              const filenameInput =
                settingsPanel.querySelector("#filenameInput");
              const staticNameRadio =
                settingsPanel.querySelector("#staticName");
              const randomNameRadio =
                settingsPanel.querySelector("#randomName");
              const formatInput = settingsPanel.querySelector("#formatInput");
              const saveButton = settingsPanel.querySelector("#saveSettings");
              const realVoiceMessageToggle = settingsPanel.querySelector(
                "#realVoiceMessageToggle"
              );
              const keybindCard = settingsPanel.querySelector("#keybindCard");
              const filenameCard = settingsPanel.querySelector("#filenameCard");
              const formatCard = settingsPanel.querySelector("#formatCard");

              const savedSettings =
                BdApi.getData("VoiceMessages", "settings") || {};
              keybindInput.value = savedSettings.keybind || "F12";
              filenameInput.value = savedSettings.filename || "";
              staticNameRadio.checked = !savedSettings.useRandomFilename;
              randomNameRadio.checked = savedSettings.useRandomFilename;
              formatInput.value = savedSettings.format || "ogg";
              realVoiceMessageToggle.checked =
                savedSettings.realVoiceMessage || false;

              const toggleFeatureCards = () => {
                if (realVoiceMessageToggle.checked) {
                  keybindCard.classList.add("disabled");
                  filenameCard.classList.add("disabled");
                  formatCard.classList.add("disabled");
                } else {
                  keybindCard.classList.remove("disabled");
                  filenameCard.classList.remove("disabled");
                  formatCard.classList.remove("disabled");
                }
              };

              realVoiceMessageToggle.addEventListener(
                "change",
                toggleFeatureCards
              );

              const toggleFilenameInput = () => {
                if (randomNameRadio.checked) {
                  filenameInput.classList.add("hidden");
                } else {
                  filenameInput.classList.remove("hidden");
                }
              };

              randomNameRadio.checked = true;
              staticNameRadio.checked = false;

              toggleFilenameInput();
              toggleFeatureCards();

              staticNameRadio.addEventListener("change", toggleFilenameInput);
              randomNameRadio.addEventListener("change", toggleFilenameInput);

              saveButton.addEventListener("click", () => {
                const newSettings = {
                  keybind: keybindInput.value,
                  filename: filenameInput.value,
                  useRandomFilename: randomNameRadio.checked,
                  format: formatInput.value,
                  realVoiceMessage: realVoiceMessageToggle.checked,
                };

                BdApi.saveData("VoiceMessages", "settings", newSettings);
                BdApi.showToast("Settings saved successfully!", {
                  type: "success",
                  icon: "✔️",
                });
              });

              return settingsPanel;
            }

            static generateRandomFileName = function () {
              const names = [
                "PixelPurr😺",
                "FuzzyFling🦄",
                "ChirpChomp🐦",
                "BlipBop🎉",
                "DoodlePop🧚‍♀️",
                "SizzleSnap🔥",
                "GlimmerGlow🌟",
                "SqueakZoom🐭",
                "FizzFizz💧",
                "BuzzBop💥",
                "ZapZap⚡",
                "TwinkleTee✨",
                "SparkleSwoosh💫",
                "TwangTee🎵",
                "QuirkyQuip🤪",
                "ChirpBing🐣",
                "PopFizz🍾",
                "DoodleBloop🌀",
                "GlimmerPop💎",
                "SqueakZap⚡️",
                "TwistyTing🎠",
                "SnappySparkle✨",
                "WhisperWiz🌌",
                "GlitzyGlimpse💫",
                "FuzzyFizz🐼",
                "BubblyBuzz💧",
                "SlickSizzle🔥",
                "QuirkyChirp🐦",
                "DazzleGlow🌟",
                "GlimmerSnap✨",
                "WhisperTing🕊️",
                "PopFizz🎈",
                "SqueakySnap🐭",
                "FizzFizz💦",
                "BuzzBling💎",
                "TwinklePop🌠",
                "DoodleSwoosh🌌",
                "SnapSparkle🌟",
                "BlingBop💥",
                "WhisperFizz✨",
                "GlimmerTee🎵",
                "SizzleBling🔥",
                "PopBling💫",
                "TwistySwoosh🎠",
                "WhisperSparkle🌌",
                "GlitzyChirp🐦",
                "FizzBling💧",
                "BuzzPop💥",
                "SlickTing🔥",
                "QuirkyBop🤪",
                "ChirpSizzle🐦",
                "TwistBling🎠",
                "DoodlePop💎",
                "GlimmerSwoosh✨",
                "SnapBuzz💧",
                "WhisperPop🌌",
                "FizzTing💦",
                "BuzzSnap💥",
                "SizzleChirp🔥",
                "TwistSwoosh🎠",
                "PopFizz✨",
                "GlimmerBop💎",
                "ChirpTing🐦",
                "WhisperSwoosh🌌",
                "TwistPop🎠",
                "DoodleSnap💫",
                "SizzleFling🔥",
                "BuzzBling💥",
                "TwistBop🎠",
                "GlimmerFizz✨",
                "PopTing💦",
                "SlickSnap🔥",
                "BlingChirp💎",
                "WhisperBling🌌",
                "DoodleFling🌀",
                "FizzBuzz💦",
                "TwistBling🎠",
                "PopSizzle💥",
                "ChirpBling🐦",
                "GlimmerSwoosh✨",
                "FizzPop💧",
                "TwistSnap🎠",
                "BlingSizzle💫",
                "WhisperFizz🌌",
                "DoodleBop💫",
                "FizzBop💦",
                "GlimmerFling💎",
                "SizzlePop🔥",
                "TwistTee🎠",
                "WhisperSnap🌌",
                "PopFizz💥",
                "BlingSwoosh💫",
                "ChirpTee🐦",
                "TwistBling🎠",
                "DoodleSnap💫",
                "GlitterBuzz💫",
                "SqueakBling🐭",
                "BuzzFizz💥",
                "ChirpDazzle🐦",
                "TwistFizz🎠",
                "DoodleBling🌀",
                "SparkleChirp💫",
                "PopSnap💧",
                "FizzChirp💦",
                "BlingSwoosh🎠",
                "SizzlePop💥",
                "TwistBuzz🔥",
                "DoodleFizz🌀",
                "ChirpTing🐦",
                "SlickBling🔥",
                "WhisperPop🌌",
                "BuzzSwoosh💥",
                "GlimmerChirp💎",
                "FizzSnap💦",
                "BlingTwist🎠",
                "DoodleBling💎",
                "SizzleChirp🐦",
                "BuzzFizz💦",
                "PopSparkle💫",
                "TwistFizz🎠",
                "ChirpSizzle🐦",
                "FizzBop💧",
                "DoodleBling🌀",
                "WhisperBuzz🌌",
                "SizzleFizz🔥",
                "BuzzChirp💥",
                "TwistBop🎠",
                "GlimmerFizz💎",
                "SlickFizz🔥",
                "PopTwist🎈",
                "DoodleBuzz🌀",
                "FizzSnap💦",
                "ChirpPop🐦",
                "TwistBling🎠",
                "SizzleBuzz🔥",
                "GlimmerBling💎",
                "PopSizzle💥",
                "WhisperFling🌌",
                "BuzzFizz💥",
                "DoodleChirp🌀",
                "FizzPop💧",
                "TwistSnap🎠",
                "SizzleBling🔥",
                "WhisperBop🌌",
                "BuzzFizz💦",
                "ChirpTwist🐦",
                "DoodleFizz🌀",
                "SizzleFizz🔥",
                "FizzBop💧",
                "GlimmerBling💎",
                "BuzzSnap💥",
                "PopChirp🎈",
                "TwistSizzle🎠",
                "WhisperSnap🌌",
                "FizzBuzz💦",
                "DoodleChirp💫",
                "SizzleFizz🔥",
                "ChirpBling🐦",
                "PopFizz💥",
                "BuzzFizz💦",
                "FizzBop💧",
                "TwistFizz🎠",
                "GlimmerFizz💎",
                "WhisperBuzz🌌",
                "SizzleBling🔥",
                "DoodleSnap🌀",
                "FizzPop💧",
                "ChirpFizz🐦",
                "TwistBuzz🎠",
                "SizzleBling🔥",
                "PopSnap💥",
                "FizzChirp💦",
                "BuzzBling💥",
                "DoodleFizz🌀",
                "WhisperFizz🌌",
              ];
              return names[Math.floor(Math.random() * names.length)];
            };
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
