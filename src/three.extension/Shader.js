
THREE.ShaderChunk.meshbasic_vert = [
    '#include <common>',
    '#include <uv_pars_vertex>',
    '#include <uv2_pars_vertex>',
    '#include <envmap_pars_vertex>',
    '#include <lights_pars_begin>',
    '#include <color_pars_vertex>',
    '#include <fog_pars_vertex>',
    '#include <morphtarget_pars_vertex>',
    '#include <skinning_pars_vertex>',
    '#include <shadowmap_pars_vertex>',
    '#include <logdepthbuf_pars_vertex>',
    '#include <clipping_planes_pars_vertex>',
    'void main() {',
        '#include <uv_vertex>',
        '#include <uv2_vertex>',
        '#include <color_vertex>',
        '#include <skinbase_vertex>',

        '#ifdef USE_ENVMAP',
        '#include <beginnormal_vertex>',
        '#include <morphnormal_vertex>',
        '#include <skinnormal_vertex>',
        '#include <defaultnormal_vertex>',
        '#endif',
        '#include <begin_vertex>',
        '#include <morphtarget_vertex>',
        '#include <skinning_vertex>',
        '#include <project_vertex>',
        '#include <logdepthbuf_vertex>',

        '#include <worldpos_vertex>',
        '#include <clipping_planes_vertex>',
        '#include <envmap_vertex>',
        '#include <shadowmap_vertex>',
        '#include <fog_vertex>',
    '}',
].join('\n');

THREE.ShaderChunk.meshbasic_frag = [
    'uniform vec3 diffuse;',
    'uniform float opacity;',
    '#ifndef FLAT_SHADED',
    'varying vec3 vNormal;',
    '#endif',
    '#include <common>',
    '#include <packing>',
    '#include <color_pars_fragment>',
    '#include <uv_pars_fragment>',
    '#include <uv2_pars_fragment>',
    '#include <map_pars_fragment>',
    '#include <alphamap_pars_fragment>',
    '#include <aomap_pars_fragment>',
    '#include <lightmap_pars_fragment>',
    '#include <envmap_pars_fragment>',
    '#include <lights_pars_begin>',
    '#include <fog_pars_fragment>',
    '#include <shadowmap_pars_fragment>',
    '#include <shadowmask_pars_fragment>',
    '#include <specularmap_pars_fragment>',
    '#include <logdepthbuf_pars_fragment>',
    '#include <clipping_planes_pars_fragment>',
    'void main() {',
        '#include <clipping_planes_fragment>',
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        '#include <logdepthbuf_fragment>',
        '#include <map_fragment>',
        '#include <color_fragment>',
        '#include <alphamap_fragment>',
        '#include <alphatest_fragment>',
        '#include <specularmap_fragment>',
        'ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );',
        // accumulation (baked indirect lighting only)
        '#ifdef USE_LIGHTMAP',
        'reflectedLight.indirectDiffuse += texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;',
        '#else',
        'reflectedLight.indirectDiffuse += vec3( 1.0 );',
        '#endif',
        // modulation
        '#include <aomap_fragment>',
        'reflectedLight.indirectDiffuse *= diffuseColor.rgb;',
        'vec3 outgoingLight = reflectedLight.indirectDiffuse * min((0.5 + getShadowMask()), 1.0);',
        '#include <envmap_fragment>',
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
        '#include <premultiplied_alpha_fragment>',
        '#include <tonemapping_fragment>',
        '#include <encodings_fragment>',
        '#include <fog_fragment>',
    '}',
].join('\n');

THREE.ShaderLib.basic = {
    uniforms: THREE.UniformsUtils.merge( [
        THREE.UniformsLib.common,
        THREE.UniformsLib.specularmap,
        THREE.UniformsLib.envmap,
        THREE.UniformsLib.aomap,
        THREE.UniformsLib.lightmap,
        THREE.UniformsLib.fog,
        THREE.UniformsLib.lights
    ] ),

    vertexShader: THREE.ShaderChunk.meshbasic_vert,
    fragmentShader: THREE.ShaderChunk.meshbasic_frag
}

THREE.ShaderChunk.points_vert = [
    'uniform float size;',
    'uniform float scale;',

    '#include <common>',
    '#include <color_pars_vertex>',
    '#include <fog_pars_vertex>',
    '#include <morphtarget_pars_vertex>',
    '#include <logdepthbuf_pars_vertex>',
    '#include <clipping_planes_pars_vertex>',

    'void main() {',

    '	#include <color_vertex>',
    '	#include <begin_vertex>',
    '	#include <morphtarget_vertex>',
    '	#include <project_vertex>',

    '	#ifdef USE_SIZEATTENUATION',
    '		gl_PointSize = size * ( scale / - mvPosition.z );',
    '	#else',
    '		gl_PointSize = size;',
    '	#endif',

    '	#include <logdepthbuf_vertex>',
    '	#include <clipping_planes_vertex>',
    '	#include <worldpos_vertex>',
    '	#include <fog_vertex>',

    '}',
].join('\n');

THREE.ShaderChunk.points_frag = [
    'uniform vec3 diffuse;',
    'uniform float opacity;',
    '#include <common>',
    '#include <packing>',
    '#include <color_pars_fragment>',
    '#include <map_particle_pars_fragment>',
    '#include <fog_pars_fragment>',
    '#include <logdepthbuf_pars_fragment>',
    '#include <clipping_planes_pars_fragment>',
    'void main() {',
    '  float dist = distance(gl_PointCoord, vec2(0.5,0.5));',
    '  if(dist > 0.5){',
    '  discard;}',
    '	#include <clipping_planes_fragment>',
    '	vec3 outgoingLight = vec3( 0.0 );',
    '	vec4 diffuseColor = vec4( diffuse, opacity );',
    '	#include <logdepthbuf_fragment>',
    '	#include <map_particle_fragment>',
    '	#include <color_fragment>',
    '	#include <alphatest_fragment>',
    '	outgoingLight = diffuseColor.rgb;',
    '	gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
    '	#include <premultiplied_alpha_fragment>',
    '	#include <tonemapping_fragment>',
    '	#include <encodings_fragment>',
    '	#include <fog_fragment>',
    '}',
].join('\n');


THREE.ShaderLib.points = {
    uniforms: THREE.UniformsUtils.merge( [
        THREE.UniformsLib.points,
        THREE.UniformsLib.fog
    ] ),

    vertexShader: THREE.ShaderChunk.points_vert,
    fragmentShader: THREE.ShaderChunk.points_frag
}


