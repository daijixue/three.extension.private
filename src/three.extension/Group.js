/**
 * 扩展 three.js 中的 Group 类，基础信息请参考 three.js 官方文档
 * @class Group
 * @memberOf THREE
 */

/**
 * 删除过期数据
 * @param {number} maxFrameCount -大于 maxFrameCount 帧未访问的数据为过期数据
 */
THREE.Group.prototype.removeUnExpectedChild = function (maxFrameCount) {
    for(let n=0, length = this.children.length; n<length; ++n) {
        if(this.children[n].removeUnExpectedChild) {
            this.children[n].removeUnExpectedChild(maxFrameCount);
        }
    }
};

/**
 * 更新函数，由渲染循环调用
 * @param {object} context -更新上下文参数
 */
THREE.Group.prototype.update = function (context) {
    this.visible = true;
    let updatingChildren = [];
    let lookAt = context.camera.matrixWorldInverse.getLookAt();
    for(let n=0, length = this.children.length; n<length; n++) {
        const bs = this.children[n].getBoundingSphereWorld();
        if(!bs.valid() || context.frustum.intersectsSphere(bs)) {
            this.children[n].visible = true;
            this.children[n].frustumCulled = false;
        }
        else {
            this.children[n].visible = false;
        }
        //
        if(this.children[n].update) {
            updatingChildren[updatingChildren.length] = {child:this.children[n], disToEye:lookAt.eye.clone().sub(bs.center).length()};
            //this.children[n].update(context);
        }
    }
    //
    updatingChildren.sort((a,b)=> {return a.disToEye - b.disToEye});
    for(let n=0, length = updatingChildren.length; n<length; ++n) {
        updatingChildren[n].child.update(context);
    }
};

/**
 * 射线相交测试
 * @param {THREE.Raycaster} raycaster
 * @param {Array} intersects -输出参数，与射线相交的对象，按到射线起点的距离排序
 */
THREE.Group.prototype.raycast = function (raycaster, intersects) {
    for(let i=0, length = this.children.length; i<length; ++i) {
        if(this.children[i].visible) {
            this.children[i].raycast( raycaster, intersects );
        }
    }
};

/**
 * 释放函数
 */
THREE.Group.prototype.dispose = function (gpuRelease = true, memRelease = true) {
    for(let n=0, length = this.children.length; n<length; n++) {
        this.children[n].dispose(gpuRelease, memRelease);
        if(memRelease)
          this.children[n] = null;
    }
    if(memRelease)
      this.children = [];
};