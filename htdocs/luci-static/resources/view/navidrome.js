'use strict';
'require view';
'require form';
'require tools.widgets as widgets';
'require uci';
'require rpc';
'require fs';
var callServiceList = rpc.declare({
	object: 'service',
	method: 'list',
	params: [ 'name' ],
	expect: { 'navidrome': {} }
});

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(callServiceList('navidrome')),
			uci.load('navidrome'),
		]);
	},
  render: function(res) {
		var m, s, o, stat;
	
		var port = uci.get('navidrome', 'navidrome','port');
		var running = Object.keys(res[0].instances || {}).length > 0;
		var stat = '<b><font color="red">' + _("Navidrome is Stopped.") + '</font></b>';
		if (running) {
			stat = '<b><font color="green">' + _("Navidrome is Running.") + '</font></b>　　<a href="http://' + window.location.hostname + ':' + port + '" target="_blank" style="background: gray; color:black; padding:2px; border-radius: 5px; text-decoration: none;">' + _('Open Navidrome') + '</a>';
        }
		m = new form.Map('navidrome', "Navidrome", 
		_('Navidrome is a self-hosted, open source music server and streamer.<br/>It gives you freedom to listen to your music collection from any browser or mobile device.<br/><br/>'));


		s = m.section(form.TypedSection, 'navidrome', stat);
		s.anonymous = true;
		s.tab('service',  _('Service'));
		s.tab('config',  _('Navidrome Config'));
		s.tab('configfile',  _('Navidrome Config File'));
		
		o = s.taboption('service',form.Flag, 'enabled', _('Service Enable'));
		o = s.taboption('service', widgets.UserSelect, 'user', _('User'));
		
		o = s.taboption('service',form.Value, 'prog', _('Program Path'));
			o.default = "/usr/bin/navidrome";
			o.placeholder = "/usr/bin/navidrome";
			o.rmempty = false;
			
		o = s.taboption('service', form.Value, 'port', _('Port'),
			_('HTTP port Navidrome will use (default 4533)'));
			o.default = "4533";
			o.placeholder = "4533";
			o.rmempty = false;
					
		o = s.taboption('service',form.Value, 'datafolder', _('Data Folder'), _('folder to store application data (DB, cache...)'));
			o.default = "/etc/navidrome";
			o.placeholder = "/etc/navidrome";
			o.rmempty = false;
			
		o = s.taboption('service', form.Value, 'musicfolder', _('Music Folder'),_('folder where your music is stored'));
			o.default = "/music";
			o.placeholder = "/music";
			o.rmempty = false;

		o = s.taboption('config',form.Flag, 'enabletranscodingconfig', _('Enable Transcoding Config'),
			_('Enables Transcoding Configuration in the UI'));
			
		o = s.taboption('config', form.Value, 'imagecachesize', _('Image Cache Size (MB)'),
			_('size of image (art work) cache. set to 0 to disable cache'));
			o.default = "100";
			o.placeholder = "100";
			o.rmempty = false;
		o = s.taboption('config', form.Value, 'transcodingcachesize', _('TransCoding Cache Size (MB)'),
			_('size of transcoding cache. set to 0 to disable cache'));
			o.default = "100";
			o.placeholder = "100";
			o.rmempty = false;
			
		o = s.taboption('config',form.ListValue, 'loglevel', _('Log Level'));
			o.value("error");
			o.value("info");
			o.value("debug");
			o.value("trace");
			o.default = "info";
			
		o = s.taboption('config',form.Flag, 'use_bg', _('Change Background Image'),
			_('Default : random music image from Unsplash.com'));
		
		o = s.taboption('config', form.Value, 'use_bg_path', _('backaground image URL'),
			_('URL to a backaground image used in the Login page'));
			o.depends('use_bg', '1');
			o.rmempty = false;
			
		var link = '<br/><a href="https://www.navidrome.org/docs/usage/configuration-options/#available-options" target="_blank">https://www.navidrome.org/docs/usage/configuration-options/#available-options</a>';
		o = s.taboption('configfile', form.TextValue, '_tmpl',
			null,
			_('Please see available options to customize Navidrome for your needs at.') + link );
			
		o.rows = 20;
		o.cfgvalue = function(section_id) {
			return fs.trimmed('/etc/navidrome/navidrome.toml');
		};
		o.write = function(section_id, formvalue) {
			return fs.write('/etc/navidrome/navidrome.toml', formvalue.trim().replace(/\r\n/g, '\n') + '\n');
		};
	
    return m.render();
  }
});
