package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.OpenMenuLogRes;
import kr.co.kfs.asseterp.biz.sys.dto.OpenMenuLogSearchParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys96_open_menu_log.xml (selectByTextAdminPaging, selectByTextAdminPagingTotal) */
@Mapper
public interface SysOpenMenuLogMapper {
    List<OpenMenuLogRes> selectByTextAdminPaging(@Param("p") OpenMenuLogSearchParam param);

    int selectByTextAdminPagingTotal(@Param("p") OpenMenuLogSearchParam param);
}
