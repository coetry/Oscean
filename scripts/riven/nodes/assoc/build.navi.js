'use strict';

function BuildNaviNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z"

  this.cache = null;

  this.answer = function(q)
  {
    let html = ""
    const portal = q.result ? q.result.portal() : null;

    if(!portal){ return " " }

    return `
    <table>
    <tr><td><svg id="glyph"><path transform="scale(0.12) translate(0,-150)" d="${portal.glyph()}"></path></svg></td></tr>
    <tr><td>${this.make_table(portal,q.tables.lexicon,3,q.result)}</td></tr>
    </table>`
  }

  this.make_table = function(term,lexicon,depth = 3, selection = null)
  {
    if(depth <= 0){ return "" }
    const children = term.children
    if(children.length == 0){ return ""}

    let html = ""

    if(depth == 2){
      for(const id in children){
        const child = children[id];
        html += selection && child.name == selection.name ?  `<span class='depth${depth}'>{*${child.name.capitalize()}*}${this.make_table(child,lexicon,depth-1,selection)}</span> `.to_curlic() : `<span class='depth${depth}'>{(${child.name.capitalize()})}${this.make_table(child,lexicon,depth-1,selection)}</span> `.to_curlic()
      }
      return html
    }

    if(depth == 1){
      for(const id in children){
        const child = children[id];
        html += selection && child.name == selection.name ? `<span class='depth${depth}'>{*${child.name.capitalize()}*}</span> `.to_curlic() : `<span class='depth${depth}'>{(${child.name.capitalize()})}</span> `.to_curlic()
      }
      return children.length > 0 ? `(${html.trim()})` : ''
    }
    html += "<table width='100%'>"
    for(const id in children){
      const child = children[id];
      html += `<tr class='head'><th class='${selection && child.name == selection.name ? 'selected' : ''}'>{(${child.name.capitalize()})}</th><td>${this.make_table(child,lexicon,depth-1,selection)}</td></tr>`.to_curlic()
    }
    html += "</table>"
    return html
  }
}