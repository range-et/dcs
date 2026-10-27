local diff = {
	["keyDiffs"] = {
		["d3087pnilu3087cd57vd1vpnilvu0"] = { ["name"] = "Trigger", ["added"] = { [1] = { ["key"] = "JOY_BTN7" }, [2] = { ["key"] = "JOY_BTN8" } } },
		["dnilp2101u2101cdnilvdnilvp1vu-1"] = { ["name"] = "Wheel Brake both", ["added"] = { [1] = { ["key"] = "JOY_BTN3" } } },
		["d3016pnilunilcd18vd1vpnilvunil"] = { ["name"] = "Gears Down", ["added"] = { [1] = { ["key"] = "JOY_BTN2" } } },
		["d3016pnilunilcd18vd0vpnilvunil"] = { ["name"] = "Gears Up", ["added"] = { [1] = { ["key"] = "JOY_BTN1" } } },
		["d3998pnilunilcd19vd0.8vpnilvunil"] = { ["name"] = "Flaps Up", ["added"] = { [1] = { ["key"] = "JOY_BTN6" } } },
		["d3998pnilunilcd19vd0.5vpnilvunil"] = { ["name"] = "Flaps Down", ["added"] = { [1] = { ["key"] = "JOY_BTN4" } } },
		["d3217pnilunilcd40vd1vpnilvunil"] = { ["name"] = "Display mode cruise", ["added"] = { [1] = { ["key"] = "JOY_BTN11" } } },
		["d3218pnilunilcd40vd1vpnilvunil"] = { ["name"] = "Display mode air to air", ["added"] = { [1] = { ["key"] = "JOY_BTN10" } } },
		["d3219pnilunilcd40vd1vpnilvunil"] = { ["name"] = "Display mode air to ground", ["added"] = { [1] = { ["key"] = "JOY_BTN9" } } },
		["d3079pnilunilcd55vd1vpnilvunil"] = { ["name"] = "Weapon Selector Gun", ["added"] = { [1] = { ["key"] = "JOY_BTN14" } } },
		["d3079pnilunilcd55vd0.5vpnilvunil"] = { ["name"] = "Weapon Selector Sparrow or Phoenix Missiles", ["added"] = { [1] = { ["key"] = "JOY_BTN13" } } },
		["d3079pnilunilcd55vd-0.5vpnilvunil"] = { ["name"] = "Weapon Selector Sidewinder Missiles", ["added"] = { [1] = { ["key"] = "JOY_BTN12" } } },
		["d3040pnilunilcd22vd-1vpnilvunil"] = { ["name"] = "Autopilot Off", ["added"] = { [1] = { ["key"] = "JOY_BTN17" } } },
		["d3040pnilu3040cd22vd1vpnilvu-1"] = { ["name"] = "Autopilot On, else Off", ["added"] = { [1] = { ["key"] = "JOY_BTN18" } } },
		["d3038pnilu3038cd22vd1vpnilvu-1"] = { ["name"] = "Altitude Hold On, else Off", ["added"] = { [1] = { ["key"] = "JOY_BTN19" } } },
		["d3039pnilu3039cd22vd1vpnilvu0"] = { ["name"] = "Heading Hold On, else Off", ["added"] = { [1] = { ["key"] = "JOY_BTN20" } } },
		["d3026pnilu3026cd17vd1vpnilvu0"] = { ["name"] = "Wing Sweep Aft", ["added"] = { [1] = { ["key"] = "JOY_BTN21" } } },
		["d3024pnilu3024cd17vd1vpnilvu0"] = { ["name"] = "Wing Sweep Auto Mode", ["added"] = { [1] = { ["key"] = "JOY_BTN22" } } },
		["d3025pnilu3025cd17vd1vpnilvu0"] = { ["name"] = "Wing Sweep Forward", ["added"] = { [1] = { ["key"] = "JOY_BTN23" } } },
		["d179pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Communication menu", ["added"] = { [1] = { ["key"] = "JOY_BTN25" } } },
		["d3550pnilu3550cd62vd1vpnilvu-1"] = { ["name"] = "Toggle Menu", ["added"] = { [1] = { ["key"] = "JOY_BTN24" } } },
	},

	["axisDiffs"] = {
		["a2001cdnil"] = {
			["changed"] = {
				[1] = {
					["filter"] = {
						["curvature"] = {
							[1] = 0,
						},
						["deadzone"] = 0,
						["hardwareDetent"] = false,
						["hardwareDetentAB"] = 0,
						["hardwareDetentMax"] = 0,
						["invert"] = true,
						["saturationX"] = 1,
						["saturationY"] = 1,
						["slider"] = false,
					},
					["key"] = "JOY_Y",
				},
			},
			["name"] = "Pitch",
		},
		["a2002cdnil"] = {
			["added"] = {
				[1] = {
					["key"] = "JOY_RX",
				},
			},
			["name"] = "Roll",
			["removed"] = {
				[1] = {
					["key"] = "JOY_X",
				},
			},
		},
		["a2003cdnil"] = {
			["added"] = {
				[1] = {
					["key"] = "JOY_X",
				},
			},
			["name"] = "Rudder",
			["removed"] = {
				[1] = {
					["key"] = "JOY_RZ",
				},
			},
		},
		["a2004cdnil"] = {
			["changed"] = {
				[1] = {
					["filter"] = {
						["curvature"] = {
							[1] = 0,
						},
						["deadzone"] = 0,
						["hardwareDetent"] = false,
						["hardwareDetentAB"] = 0,
						["hardwareDetentMax"] = 0,
						["invert"] = true,
						["saturationX"] = 1,
						["saturationY"] = 1,
						["slider"] = false,
					},
					["key"] = "JOY_Z",
				},
			},
			["name"] = "Thrust",
		},
	},
}
return diff