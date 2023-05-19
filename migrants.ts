import * as fs from 'fs';

class ScriptSettings {
    private v2Backup: any;
    public setting: any;
    public v3DefaultSettings: any;
    public version: string;

    constructor() {
        this.v2Backup = JSON.parse(fs.readFileSync('./listen1_backup.json', 'utf-8'));
        this.setting = {
            language: this.v2Backup.language,
            theme: this.v2Backup.theme,
            playerSetting: this.v2Backup["player-settings"],
        };
        this.v3DefaultSettings = [
            { key: "enableAutoChooseSource", value: false },
            { key: "enableGlobalShortCut", value: false },
            { key: "enableLyricFloatingWindow", value: false },
            { key: "enableLyricFloatingWindowTranslation", value: false },
            { key: "enableLyricTranslation", value: false },
            { key: "enableNowplayingBitrate", value: false },
            { key: "enableNowplayingComment", value: false },
            { key: "enableNowplayingCoverBackground", value: false },
            { key: "enableNowplayingPlatform", value: false },
            { key: "enableStopWhenClose", value: true },
            { key: "favorite_playlist_order", value: [] },
            { key: "language", value: "zh-CN" },
            { key: "lyricFontSize", value: 15 },
            { key: "lyricFontWeight", value: 400 },
            {
                key: "my_playlist_order",
                value: [
                    "myplaylist_redheart",
                    "myplaylist_75390912-a84c-4d74-87d5-457ee420e950",
                ],
            },
            { key: "playerSettings", value: {} },
            { key: "theme", value: "black" },
        ];
        this.version = "3";
    }

    public getCurrentPlayinglistTracks(): any[] {
        const tracks = this.v2Backup["current-playing"];
        const formattedTracks = [];

        for (const track of tracks) {
            delete track.disabled;
            track.playlist = "current";
            formattedTracks.push(track);
        }

        return formattedTracks;
    }

    public getMyPlaylistTrack(): any[] {
        const playerlists = this.v2Backup.playerlists;
        const formattedTracks = [];

        for (const playlistId of playerlists) {
            const playlist = this.v2Backup[playlistId];
            const tracks = playlist.tracks;
            const playlistName = playlist.info.title;

            for (const track of tracks) {
                delete track.disabled;
                delete track.index;
                delete track.playNow;
                delete track.platformText;

                track.playlist = playlistId;
                formattedTracks.push(track);
            }
        }
        return formattedTracks;
    }

    public getMyPlaylist(): any[] {
        const playerlists = this.v2Backup["playerlists"];
        const formattedLists = [];

        for (let i = 0; i < playerlists.length; i++) {
            const playlistId = playerlists[i];
            const playlistData = this.v2Backup[playlistId];

            const formattedPlaylist = {
                cover_img_url: playlistData.info.cover_img_url,
                title: playlistData.info.title,
                id: playlistData.info.id,
                source_url: playlistData.info.source_url,
                type: "my",
                order: playlistData.tracks.map((track) => track.id),
            };

            formattedLists.push(formattedPlaylist);
        }

        return formattedLists;
    }

    public getFavoritePlaylist(): any[] {
        const favoritePlayerLists = this.v2Backup.favoriteplayerlists || [];
        const formattedLists = [];

        for (let i = 0; i < favoritePlayerLists.length; i++) {
            const playlistId = favoritePlayerLists[i];
            const playlistData = this.v2Backup[playlistId];

            const formattedPlaylist = {
                id: playlistData.info.id,
                cover_img_url: playlistData.info.cover_img_url,
                title: playlistData.info.title,
                description: "",
                source_url: playlistData.info.source_url,
                type: "favorite",
            };

            formattedLists.push(formattedPlaylist);
        }

        return formattedLists;
    }

    public getCurrentPlayinglist(): any[] {
        if (!this.v2Backup || !this.v2Backup["current-playing"]) {
            console.log("current-playing does not exist");
            return [];
        }

        const order = this.v2Backup["current-playing"].map((item) => item.id);
        const currentObject = {
            id: "current",
            title: "current",
            cover_img_url: "",
            type: "current",
            order: order,
        };
        return [currentObject];
    }

    public getPlaylists(): any[] {
        const currentPlayingList = this.getCurrentPlayinglist();
        const myPlaylist = this.getMyPlaylist();
        const favoritePlaylist = this.getFavoritePlaylist();
        return currentPlayingList.concat(myPlaylist, favoritePlaylist);
    }

    public setPlayerSetting() {
        let playerSettingsValue;
        for (let index = 0; index < this.v3DefaultSettings.length; index++) {
            if (this.v3DefaultSettings[index].key === "playerSettings") {
                playerSettingsValue = this.v3DefaultSettings[index].value;
                break;
            }
        }
        playerSettingsValue = this.setting.playerSetting;
    }

    public setPlaylistOrder(playlists: any[], v3DefaultSettings: any[]) {
        const myPlaylistIds = [];

        for (const playlist of playlists) {
            if (playlist.type === "my") {
                myPlaylistIds.push(playlist.id);
            }
        }

        for (const setting of v3DefaultSettings) {
            if (setting.key === "my_playlist_order") {
                setting.value = myPlaylistIds;
                break;
            }
        }
    }

    public setCurrentPlayingTrack(id: string, tracks: any[]) {
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].id === id) {
                tracks[i].highlight = true;
                break;
            }
        }
    }

    public getTracks(): any[] {
        const myPlaylistTracks = this.getMyPlaylistTrack();
        const currentPlayinglistTracks = this.getCurrentPlayinglistTracks();
        const mergedTracks = myPlaylistTracks.concat(currentPlayinglistTracks);
        return mergedTracks;
    }

    public configV3Backup(): any {
        const v3Backup = {
            Tracks: this.getTracks(),
            Settings: [],
            Playlists: this.getPlaylists(),
            version: "3",
        };
        this.setPlayerSetting();
        this.setCurrentPlayingTrack(
            this.setting.playerSetting.nowplaying_track_id,
            v3Backup["Tracks"]
        );
        this.setPlaylistOrder(v3Backup.Playlists, this.v3DefaultSettings);
        v3Backup.Settings = this.v3DefaultSettings;
        console.log(JSON.stringify(v3Backup));
        return v3Backup;
    }

    public exportToJsonFile(data: any, filePath: string) {
        const jsonString = JSON.stringify(data, null, 2);

        fs.writeFile(filePath, jsonString, "utf-8", (err) => {
            if (err) {
                console.error("写入文件时发生错误:", err);
            } else {
                console.log("JSON 文件已成功导出。");
            }
        });
    }

    public exportV3Backup() {
        const v3BackupData = this.configV3Backup();
        const filePath = "./listen1_backup_v3.json";
        this.exportToJsonFile(v3BackupData, filePath);
    }
}

// 使用示例
const scriptSettings = new ScriptSettings();
console.log(scriptSettings.setting);
console.log(scriptSettings.v3DefaultSettings);
console.log(scriptSettings.version);
scriptSettings.exportV3Backup();


