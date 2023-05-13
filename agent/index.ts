import { log } from "./logger.js";
import "frida-il2cpp-bridge";

// const header = Memory.alloc(16);
// header.writeU32(0xdeadbeef).add(4).writeU32(0xd00ff00d).add(4).writeU64(uint64("0x1122334455667788"));
// log(hexdump(header.readByteArray(16) as ArrayBuffer, { ansi: true }));
Java.perform(() => {
  console.log("hello world");
  // var process_Obj_Module_Arr = Process.enumerateModules();
  // for (var i = 0; i < process_Obj_Module_Arr.length; i++) {
  //   console.log("", process_Obj_Module_Arr[i].name);
  // }
  // listSingleModule("libil2cpp.so");
  // loadModules();
  // listUnityMethods();
  testHook();
  // testil2cppbridge();
});

function testil2cppbridge() {
  Il2Cpp.perform(() => {
    // new
    console.log(Il2Cpp.application.identifier);
    console.log(Il2Cpp.application.dataPath);
    console.log(Il2Cpp.application.version);
    Il2Cpp.trace() // creates a Il2Cpp.Bactracer instance

      //   .strategy("fuzzy") // can be either "fuzzy" or "accurate"
      // .verbose(false) // false to avoid printing the same stack twice
      .assemblies(Il2Cpp.domain.assembly("Assembly-CSharp"))
      // .filterMethods((method: any) => {
      //   console.log(method.name);
      // })
      // .filterMethods((method) => {
      //   console.log(method.name);
      //   return method.name.toLowerCase().includes("httphandler");
      // })
      .and()
      .attach("detailed");

    // const SystemString = Il2Cpp.corlib.class("System.String");
    // const SystemAction = Il2Cpp.corlib.class("System.Action`1").inflate(SystemString);

    // const delegate: Il2Cpp.Object = Il2Cpp.delegate(SystemAction, (string: Il2Cpp.String) => {
    //   console.log(`Whoa, ${string.content}!`);
    // });

    // delegate.method("Invoke").invoke(Il2Cpp.string("it works"));
  });
}

function testHook() {
  var module = Process.getModuleByName("libil2cpp.so");
  var addr = module.base.add("0x01d17558");
  var func = new NativePointer(addr.toString());
  Interceptor.attach(func, {
    onEnter: function (args) {
      console.log(JSON.stringify(args));
      console.log("onEnter");
    },
    onLeave: function (retval) {
      console.log("onLeave");
    },
  });
}
function listUnityMethods() {
  // 获取类
  var clazz = Java.use("com.unity3d.player.UnityPlayerActivity");
  // 获取类中所有函数
  var methods = clazz.class.getDeclaredMethods();

  console.log("have method count:" + methods.length);
  var i = 0;
  if (methods.length > 0) {
    //遍历函数名
    methods.forEach(function (method: string) {
      i = i + 1;
      console.log(i + ":" + method);
    });
  }
}

function listSingleModule(moduleName: string) {
  const hooks = Module.load(moduleName);
  Module.findExportByName(moduleName, "il2cpp_domain_get");
  var Exports = hooks.enumerateExports();
  for (var i = 0; i < Exports.length; i++) {
    // if (Exports[i].name.indexOf("ne") != -1) {
    //函数类型
    console.log("type:", Exports[i].type);
    //函数名称
    console.log("name:", Exports[i].name);
    //函数地址
    console.log("address:", Exports[i].address);
    // }
  }
}

function loadModules() {
  var process_Obj_Module_Arr = Process.enumerateModules();
  for (var i = 0; i < process_Obj_Module_Arr.length; i++) {
    if (
      process_Obj_Module_Arr[i].path.indexOf("/system") == -1 &&
      process_Obj_Module_Arr[i].path.indexOf("/apex") == -1 &&
      process_Obj_Module_Arr[i].path.indexOf("/vendor") == -1
    ) {
      console.log("模块名称:", process_Obj_Module_Arr[i].name);
      console.log("模块地址:", process_Obj_Module_Arr[i].base);
      console.log("大小(KB):", process_Obj_Module_Arr[i].size / 1024);
      console.log("文件系统路径", process_Obj_Module_Arr[i].path);
      console.log("---");
    }
  }
}
// Process.getModuleByName("libSystem.B.dylib")
//   .enumerateExports()
//   .slice(0, 16)
//   .forEach((exp, index) => {
//     log(`export ${index}: ${exp.name}`);
//   });

// Interceptor.attach(Module.getExportByName(null, "open"), {
//   onEnter(args) {
//     const path = args[0].readUtf8String();
//     log(`open() path="${path}"`);
//   },
// });
