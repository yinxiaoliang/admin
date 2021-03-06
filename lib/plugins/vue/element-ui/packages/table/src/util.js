define(function (require, exports, module) {

  const getCell = function (event) {
    let cell = event.target;

    while (cell && cell.tagName.toUpperCase() !== 'HTML') {
      if (cell.tagName.toUpperCase() === 'TD') {
        return cell;
      }
      cell = cell.parentNode;
    }

    return null;
  };

  const getValueByPath = function (object, prop) {
    prop = prop || '';
    const paths = prop.split('.');
    let current = object;
    let result = null;
    for (let i = 0, j = paths.length; i < j; i++) {
      const path = paths[i];
      if (!current) break;

      if (i === j - 1) {
        result = current[path];
        break;
      }
      current = current[path];
    }
    return result;
  };

  const isObject = function (obj) {
    return obj !== null && typeof obj === 'object';
  };

  const orderBy = function (array, sortKey, reverse, sortMethod) {
    if (typeof reverse === 'string') {
      reverse = reverse === 'descending' ? -1 : 1;
    }
    if (!sortKey) {
      return array;
    }
    const order = (reverse && reverse < 0) ? -1 : 1;

    // sort on a copy to avoid mutating original array
    return array.slice().sort(sortMethod ? function (a, b) {
      return sortMethod(a, b) ? order : -order;
    } : function (a, b) {
      if (sortKey !== '$key') {
        if (isObject(a) && '$value' in a) a = a.$value;
        if (isObject(b) && '$value' in b) b = b.$value;
      }
      a = isObject(a) ? getValueByPath(a, sortKey) : a;
      b = isObject(b) ? getValueByPath(b, sortKey) : b;
      return a === b ? 0 : a > b ? order : -order;
    });
  };

  const getColumnById = function (table, columnId) {
    let column = null;
    table.columns.forEach(function (item) {
      if (item.id === columnId) {
        column = item;
      }
    });
    return column;
  };

  const getColumnByCell = function (table, cell) {
    const matches = (cell.className || '').match(/el-table_[^\s]+/gm);
    if (matches) {
      return getColumnById(table, matches[0]);
    }
    return null;
  };

  const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  const mousewheel = function (element, callback) {
    if (element && element.addEventListener) {
      element.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', callback);
    }
  };

  const getRowIdentity = function(row, rowKey)
  {
    if (!row) throw new Error('row is required when get row identity');
    if (typeof rowKey === 'string') {
      return row[rowKey];
    } else if (typeof rowKey === 'function') {
      return rowKey.call(null, row);
    }
  };
  module.exports = {
    getCell:getCell,
    getValueByPath:getValueByPath,
    orderBy:orderBy,
    getColumnById:getColumnById,
    getColumnByCell:getColumnByCell,
    mousewheel:mousewheel,
    getRowIdentity:getRowIdentity
  }
})
