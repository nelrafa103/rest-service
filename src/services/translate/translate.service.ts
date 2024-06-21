import { Injectable } from '@nestjs/common';
import { Translate } from '@google-cloud/translate/build/src/v2';
@Injectable()
export class TranslateService {
  translator: Translate = new Translate();
  async translate(language: string, responseBody: object[]): Promise<any> {
    const begin = new Date();
    const result: object[] = responseBody.map(async (element: any) => {
      const check: string[] = this.checkType(element);
      if (check.length == 0) return element;
      const response = await this.translator.translate(check, language);
      element.summary = response[0][0];
      element.storyline = response[0][1];
      return element;
    });
    const end = new Date();
   // console.log(end.getTime() - begin.getTime());
    const current = await Promise.all(result);
    return current;
  }

  checkType(object): string[] {
    const listOfText: string[] = [];
    if (object.summary != undefined) listOfText.push(object.summary);
    if (object.storyline != undefined) listOfText.push(object.storyline);
    return listOfText;
  }
}

/* 
 Estrucutura de la traducion: 
 [
  '¡El ladrón definitivo ha vuelto! Avanza con cuidado a medida que avanzas a través de 15 nuevos niveles complejos y no lineales llenos de botín que robar y guardias que burlar. La IA enemiga mejorada, nuevos dispositivos y una historia fascinante te llevarán al mundo de Thief II: The Metal Age, un lugar de nuevas y poderosas tecnologías, religiones fanáticas y corrupción.',
  { data: { translations: [Array] } }
]
*/
