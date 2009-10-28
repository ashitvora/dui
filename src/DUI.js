(function() {

DUI = function(deps, action) {
    if(arguments.length == 1) action = deps;
    action = action && action.constructor == Function ? action : function(){};
    var str = action.toString(), re = /DUI\.(\w+)/gim, matches = [], match;
    
    DUI.actions.push(action);
    
    if(deps && deps.constructor == Array) matches = deps;
    if(typeof jQuery == 'undefined') matches.push(DUI.jQueryURL);
    
    while(match = re.exec(str)) {
        var unique = true; match = match[1] || null;
        
        for(var i = 0; i < matches.length; i++) {
            if(matches[i] == match) unique = false;
        }
        
        if(unique && "isClass|global|prototype|_dontEnum|_ident|_bootstrap|init|create|ns|each|".search(new RegExp("(^|\\|)" + match + "\\|")) == -1) {
            matches.push(match);
        }
    }
    
    for(var i = 0; i < matches.length; i++) {
        DUI.load(matches[i]);
    }
    
    if(DUI.loading.length == 0) {
        DUI.loaded();
    }
}

DUI.loading = '';
DUI.actions = [];
DUI.jQueryURL = 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js';
DUI.moduleDir = 'src/';

DUI.load = function(module) {
    if(typeof DUI[module] != 'undefined'
        || DUI.loading.indexOf(module + '|') > -1) {
            return;
        }
    
    var src = module.search(/\.js$/) > -1 ? module : DUI.moduleDir + 'DUI.' + module + '.js';
    
    DUI.loading += module + '|';
    
    var d = document, jq = d.createElement('script'), a = 'setAttribute';
    jq[a]('type', 'text/javascript');
    jq[a]('src', src);
    jq[a]('onload', 'DUI.loaded("' + module + '")');
    d.body.appendChild(jq);
}

DUI.loaded = function(module) {
    DUI.loading = DUI.loading.replace(module + '|', '');
    
    if(DUI.loading.length == 0) {
        while(DUI.actions.length > 0) {
            DUI.actions.pop().apply(DUI);
        }
    }
}

var d = document, add = d.addEventListener, att = d.attachEvent, boot = function(e) {
    e = e || window.event;
    var y = e.type, t = e.target || e.srcElement, c = t.className, m = c.match(/(?:^|\s)boot-(hover-)?(\w+)(?:$|\s)/), h = '';
    
    if(m && (m[1] || m[2])) {
        if(m[1] == 'hover-' && y == 'mouseover' && m[2]) {
            h = m[1];
            m = m[2];
        } else if(y == 'click') {
            m = m[2];
        } else return;
        
        DUI([m + '.js'], function() {
            $('.boot-' + h + m + ', .boot-' + m).removeClass('boot-' + h + m + ' boot-' + m);
            $(t).removeClass('booting')[y]();
        });
        
        t.className = c.replace(/boot-(hover-)?(\w+)/, '') + ' booting';
    }
};

if(att) {
    att('onclick', boot);
    att('onmouseover', boot);
} else {
    add('click', boot, false);
    add('mouseover', boot, false);
}

})();
