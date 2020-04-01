
var field_html = '<div class="flex flex-wrap -mx-3 mb-6">\
<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">\
  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">\
    Field Name\
  </label>\
  <input class="appearance-none block w-full bg-gray-200 text-gray-700  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-blue-100" name="field_name" type="text" placeholder="Field Name">\
</div>\
<div class="w-full md:w-1/2 px-3">\
  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">\
    Data Type\
  </label>\
  <div class="relative">\
      <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-blue-100 focus:border-gray-500" name="data_type">\
        <option value="1">int</option>\
        <option value="2">float</option>\
        <option value="3">double</option>\
        <option value="4">char</option>\
        <option value="5">boolean</option>\
        <option value="6">String</option>\
        <option value="7">Date</option>\
      </select>\
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">\
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>\
      </div>\
    </div>                  </div>\
</div>\
<div class="flex flex-wrap -mx-3 mb-6">\
 \
  <div class="w-full md:w-full px-3">\
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">\
      GUI Component\
    </label>\
    <div class="relative">\
        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-blue-100 focus:border-gray-500" name="gui_component">\
          <option selected value="0">No GUI</option>\
          <option value="1">TextView</option>\
          <option value="2">ImageView</option>\
        </select>\
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">\
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>\
        </div>\
      </div>\
  </div>\
</div>';

function newField() {
    addElement('fields', 'div', 'field_set', field_html);
}

function addElement(parentId, elementTag, elementId, html) {
    // Adds an element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('class', elementId);
    newElement.innerHTML = html;
    p.appendChild(newElement);
}

function generateCode() {
    console.log("Code Generation Started...")
    var modelName = document.getElementById('modelName').value;
    var adapterName = document.getElementById('adapterName').value;
    var itemLayoutName = document.getElementById('itemLayoutName').value;
    //var fieldNamesValue = document.getElementById('fieldNamesValue').value;
    var fieldNames = getFieldNames();
    var fieldTypes = getFieldTypes();
    //var isGuiRequireds = getIsGuiRequireds();
    var guiComponents = getGuiComponents();

    //validation 
    //validation of modelname
    if (modelName == "") {
        alert('Please enter the ModelName');
        return false;
    } else {
        if (modelName.match(/\s/g)) {
            alert('space are not allowed');
            return false;
        }
    }

    //validation of adapterName
    if (adapterName == "") {
        alert('Please enter the adapterName');
        return false;
    } else {
        if (adapterName.match(/\s/g)) {
            alert('space are not allowed');
            return false;
        }
    }

    //validation of itemLayoutName
    if (itemLayoutName == "") {
        alert('Please enter the itemLayoutName');
        return false;
    } else {
        if (itemLayoutName.match(/\s/g)) {
            alert('space are not allowed');
            return false;
        }
    }

   

    console.log("Model Name : " + modelName + "\nAdapter Name : " + adapterName + "\nItem Layout Name : " + itemLayoutName);

    var modelFields = createClassObjects(fieldNames, fieldTypes, guiComponents, fieldNames.length);
    // console.log(modelFields.length);
    // alert("Add   implementation 'com.github.bumptech.glide:glide:4.10.0' in your gradle build file for ImageView");
    var div = document.createElement('div');
        div.setAttribute('class', 'flex flex-wrap')
        div.innerHTML  = resultHtml;
        document.getElementById('container-remove').parentNode.removeChild(document.getElementById('container-remove'));
        document.getElementById('container-add').appendChild(div);
    generateModelClassFile(modelName, modelFields);
    generateItemLayoutFile(itemLayoutName, modelFields);
    generateAdapterCodeFile(modelName, itemLayoutName, adapterName, modelFields);
    
    
}

function getFieldNames() {
    var elements = document.getElementsByName('field_name');
    var fieldNames = new Array();
    for (var i = 0; i < elements.length; i++) {
        fieldNames[i] = elements[i].value;
    }
    return fieldNames;
}

function getFieldTypes() {
    var elements = document.getElementsByName('data_type');
    var fieldTypes = new Array();
    for (var i = 0; i < elements.length; i++) {
        fieldTypes[i] = elements[i].value;
    }
    return fieldTypes;
}

function getIsGuiRequireds() {
    var elements = document.getElementsByName('gui_required');
    var gui_required = new Array();
    for (var i = 0; i < elements.length; i++) {
        gui_required[i] = elements[i].value;
    }
    return gui_required;
}

function getGuiComponents() {
    var elements = document.getElementsByName('gui_component');
    var gui_components = new Array();
    for (var i = 0; i < elements.length; i++) {
        gui_components[i] = elements[i].value;
    }
    return gui_components;
}

function createClassObjects(names, types, guiComponents, size) {
    var modelFields = new Array();
    for (var i = 0; i < size; i++) {
        var type;
        switch (types[i]) {
            case "1":
                type = "int";
                break;
            case "2":
                type = "float";
                break;
            case "3":
                type = "double";
                break;
            case "4":
                type = "char";
                break;
            case "5":
                type = "boolean";
                break;
            case "6":
                type = "String";
                break;
            case "7":
                type = "Date";
                break;
        }
        var isGuiRequired = guiComponents[i] != 0;
        var guiComponent;
        if (guiComponents[i] == 1) {
            guiComponent = "TextView";
        } else {
            guiComponent = "ImageView";
        }

        modelFields[i] = new ModelField(names[i], type, isGuiRequired, guiComponent);
        modelFields[i].print_data();
    }

    return modelFields;
}

function generateModelClassFile(modelName, modelFields) {
    var code_string = 'public class ';

    var variables = "";
    var default_constructor = "\tpublic " + modelName + "(){\n\t}\n\t";
    var constructor = "public " + modelName + "(";
    var accessors = "";
    var mutators = "";

    code_string = code_string + modelName;
    code_string = code_string + "{\n";

    for (var i = 0; i < modelFields.length; i++) {
        constructor = constructor + modelFields[i].getType() + " " + modelFields[i].getName();
        if (modelFields.length != i + 1) {
            constructor = constructor + ",";
        }
        variables = variables + "\tprivate " + modelFields[i].getType() + " " + modelFields[i].getName() + ";\n";
        accessors = accessors + "\tpublic " + modelFields[i].getType() + " get" + modelFields[i].getName() + "(){\n\t\treturn this." + modelFields[i].getName() + ";\n\t}\n";
        mutators = mutators + "\tpublic void set" + modelFields[i].getName() + "(" + modelFields[i].getType() + " " + modelFields[i].getName() + "){\n\t\tthis." + modelFields[i].getName() + " = " + modelFields[i].getName() + ";\n\t}\n";
    }
    constructor = constructor + "){\n";
    for (var i = 0; i < modelFields.length; i++) {
        constructor = constructor + "\t\tthis." + modelFields[i].getName() + " = " + modelFields[i].getName() + ";\n";
    }
    constructor = constructor + "\t}\n";

    code_string = code_string + variables + default_constructor + constructor + accessors + mutators + "}";

    downloadModel(modelName + ".java", code_string);
    console.log(code_string);
}

function generateItemLayoutFile(itemLayoutName, modelFields) {
    var layoutCode = '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<LinearLayout\n' +
        '\txmlns:android="http://schemas.android.com/apk/res/android"\n' +
        '\txmlns:app="http://schemas.android.com/apk/res-auto"\n' +
        '\txmlns:tools="http://schemas.android.com/tools"\n' +
        '\tandroid:orientation="vertical"\n' +
        '\tandroid:layout_width="match_parent"\n' +
        '\tandroid:layout_height="wrap_content">\n';

    var textViewCode = '\t<TextView\n' +
        '\t\tandroid:id="@+id/?TextView"\n' +
        '\t\tandroid:layout_width="match_parent"\n' +
        '\t\tandroid:layout_height="wrap_content"/>\n';

    var imageViewCode = '\t<ImageView\n' +
        '\t\tandroid:id="@+id/?ImageView"\n' +
        '\t\tandroid:layout_width="match_parent"\n' +
        '\t\tandroid:layout_height="wrap_content"/>\n';

    var layoutCodeEnd = '</LinearLayout';

    for (var i = 0; i < modelFields.length; i++) {
        if (modelFields[i].is_gui()) {
            if (modelFields[i].getGuiComponent() == "TextView") {
                layoutCode = layoutCode + textViewCode.replace("?", modelFields[i].getName());
            } else if (modelFields[i].getGuiComponent() == "ImageView") {
                layoutCode = layoutCode + imageViewCode.replace("?", modelFields[i].getName());
            }
        }
    }

    layoutCode = layoutCode + layoutCodeEnd;

    downloadLayoutFile(itemLayoutName + ".xml", layoutCode);
}

function generateAdapterCodeFile(modelName, itemLayoutName, adapterName, modelFields) {

    var adapterCode1 = 'import android.view.LayoutInflater;'+
    '\nimport androidx.recyclerview.widget;'+
    '\nimport android.view.View;'+
    '\nimport android.view.ViewGroup;'+
    '\nimport android.widget.TextView;\n'+
    '\npublic class ? extends RecyclerView.Adapter<?.ViewHolder> {\n\n' +
        '\tprivate List<#> list;\n' +
        '\tprivate Context context;\n' +
        '\tpublic ?(List<#> list,Context context){\n' +
        '\t\tthis.list = list = new ArrayList<>();\n' +
        '\t\tthis.context = context\n' +
        '\t}\n\n' +
        '\t@Override\n' +
        '\tpublic ViewHolder onCreateViewHolder(ViewGroup viewGroup,int i){\n' +
        '\t\tView v = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.$,viewGroup,false);\n' +
        '\t\treturn new ViewHolder(v);\n' +
        '\t}\n\n' +
        '\t@Override\n' +
        '\tpublic void onBindViewHolder(ViewHolder viewHolder,int position){\n' +
        '\t\t# & = list.get(position);\n';

    adapterCode1 = adapterCode1.replace(/\?/g, adapterName);
    adapterCode1 = adapterCode1.replace(/\$/g, itemLayoutName);
    adapterCode1 = adapterCode1.replace(/\#/g, modelName);

    var adapterCode2 = '\t}\n\n' +
        '\t@Override\n' +
        '\tpublic int getItemCount(){\n' +
        '\t\treturn list.size();\n' +
        '\t}\n\n';

    var bindViewHolder = '';
    var viewHolderClass = '\tclass ViewHolder extends RecyclerView.ViewHolder{\n\n';
    var viewHolderFields = '';
    var viewHolderClassConstructor = '\t\tpublic ViewHolder(View itemView){\n' +
        '\t\t\tsuper(itemView);\n';

    for (var i = 0; i < modelFields.length; i++) {
        var model = modelFields[i];
        var guiComponent;
        if (model.is_gui()) {
            if (model.getGuiComponent() == "TextView") {
                guiComponent = "TextView";
                viewHolderFields = viewHolderFields + '\t\tTextView ' + model.getName() + guiComponent + ';\n';
                viewHolderClassConstructor = viewHolderClassConstructor + '\t\t\t' + model.getName() + guiComponent + ' = itemView.findViewById(R.id.' + model.getName() + guiComponent + ');\n';
                switch(model.type){
                    case "int":
                        bindViewHolder = bindViewHolder + '\t\tviewHolder.' + model.getName() + guiComponent + '.setText(String.valueOf(&.get' + model.getName() + '()));\n';
                        break;
                    case "float":
                        bindViewHolder = bindViewHolder + '\t\tviewHolder.' + model.getName() + guiComponent + '.setText(String.valueOf(&.get' + model.getName() + '()));\n';
                        break;
                    case "double":
                        bindViewHolder = bindViewHolder + '\t\tviewHolder.' + model.getName() + guiComponent + '.setText(String.valueOf(&.get' + model.getName() + '()));\n';
                        break;
                    case "char":
                        bindViewHolder = bindViewHolder + '\t\tviewHolder.' + model.getName() + guiComponent + '.setText(String.valueOf(&.get' + model.getName() + '()));\n';
                        break;
                    case "boolean":
                        bindViewHolder = bindViewHolder + '\t\tviewHolder.' + model.getName() + guiComponent + '.setText(String.valueOf(&.get' + model.getName() + '()));\n';
                        break;
                    case "String":
                        bindViewHolder = bindViewHolder + '\t\tviewHolder.' + model.getName() + guiComponent + '.setText(&.get' + model.getName() + '());\n';
                        break;
                    case "Date":
                        bindViewHolder = bindViewHolder + '\t\tviewHolder.' + model.getName() + guiComponent + '.setText(&.get' + model.getName() + '().toString());\n';
                        break;
                }
            } else {
                guiComponent = "ImageView";
                viewHolderFields = viewHolderFields + '\t\tImageView ' + model.getName() + guiComponent + ';\n';
                viewHolderClassConstructor = viewHolderClassConstructor + '\t\t\t' + model.getName() + guiComponent + ' = itemView.findViewById(R.id.' + model.getName() + guiComponent + ');\n';
                bindViewHolder = bindViewHolder + '\t\tGlide.with(context).load(&.get' + model.getName() + '()).into(' + model.getName() + guiComponent + ');\n';
            }
        }

    }

    viewHolderClassConstructor = viewHolderClassConstructor + "\t\t}\n";

    viewHolderClass = viewHolderClass + viewHolderFields + viewHolderClassConstructor + "\t}\n";

    var adapterCode = adapterCode1 + bindViewHolder + adapterCode2 + viewHolderClass + "}";
    adapterCode = adapterCode.replace(/\&/g, modelName.toLowerCase());
    downloadAdapter(adapterName+".java", adapterCode);
}

function downloadModel(filename, text) {
    var element = document.getElementById('modelDownload');
    element.setAttribute('href', 'data:java/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    var element = document.getElementById('modelPreview');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('target', '_blank');

    
}

function downloadLayoutFile(filename, text) {
    var element = document.getElementById('layoutDownload');
    element.setAttribute('href', 'data:xml/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    var element = document.getElementById('layoutPreview');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('target', '_blank');

    // element.style.display = 'none';
    // document.body.appendChild(element);

    // element.click();

    // document.body.removeChild(element);
}

function downloadAdapter(filename, text) {
    var element = document.getElementById('adapterDownload');
    element.setAttribute('href', 'data:java/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    
    var element = document.getElementById('adapterPreview');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('target', '_blank');

    // element.style.display = 'none';
    // document.body.appendChild(element);

    // element.click();

    // document.body.removeChild(element);
}


class ModelField {
    constructor(name, type, is_gui, gui_component) {
        this.name = name;
        this.type = type;
        this.gui = is_gui;
        this.gui_component = gui_component;
    }

    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    is_gui() {
        return this.gui;
    }
    getGuiComponent() {
        return this.gui_component;
    }
    print_data() {
        console.log("Name : " + this.name);
        console.log("Type : " + this.type);
        console.log("Is GUI : " + this.gui);
        console.log("GUI Component : " + this.gui_component);
    }
}