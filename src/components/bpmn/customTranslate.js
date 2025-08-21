import translations from './bpmnTranslationsES';

export default function customTranslate( template, replacements ) {
  template = translations[ template ] || template;
  
  if ( replacements ) {
    Object.keys( replacements ).forEach( key => {
      template = template.replace( `{${ key }}`, replacements[ key ] );
    } );
  }
  return template;
}