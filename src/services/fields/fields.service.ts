import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import Genre from 'src/types/genre';

@Injectable({})
export class FieldsService {
  short(limit: number, offset: number): string {
    return `fields id,name,storyline,summary,url,websites,artworks.url,genres.name,cover.url;  limit ${limit}; offset ${offset};`;
  }

  shortFilterById(id: number): string {
    return `fields id,name,storyline,summary,url; where id = ${id};`;
  }

  mediumFilterById(id: number, limit: number, offset: number): string {
    return `fields id,name,storyline,summary,url,genres.name,artworks.url,artworks.height,artworks.width,websites.url,involved_companies.company.name,platforms.name,language_supports.language.name; where id = ${id};limit ${limit}; offset ${offset};`;
  }

  shortSearchByName(
    genres: string[],
    name: string,
    developers: string[],
    publishers: string[],
    platforms: string[],
    limit: number,
    offset: number,
  ): string {
    const file = readFileSync('./src/data/genres.json', 'utf-8');
    const object: Genre = JSON.parse(file);
    const request: string = `fields id,name,storyline,summary,url,genres.name,artworks.url,artworks.height;`;
    if (name != undefined) {
      const search = `search "${name}";`;
      return search.concat(`${request}limit ${limit}; offset ${offset};`);
    }
    if (genres != undefined) {
      const fields = genres.map((genre) => {
        if (object.ids[genre] != undefined) {
          return object.ids[genre];
        }
      });

      return request.concat(
        `where genres = (${fields});limit ${limit}; offset ${offset};`,
      );
    }
    return request;
  }
}
