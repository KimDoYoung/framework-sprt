package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.WebsocketPersonRes;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketPersonsParam;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketTarget;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp01_person.xml selectByLoginUserPaging·selectByLoginUserTotal */
@Mapper
public interface SysWebsocketMapper {
    /** AS-IS selectByLoginUserPaging */
    List<WebsocketPersonRes> selectByLoginUserPaging(WebsocketPersonsParam param);

    /** AS-IS selectByLoginUserTotal */
    int selectByLoginUserTotal(WebsocketPersonsParam param);

    /** 알림·강제 로그아웃 대상(TOBE: personId → {회사코드}:{사번}) */
    List<WebsocketTarget> selectTargets(@Param("personIds") List<Long> personIds);
}
