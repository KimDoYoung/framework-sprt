package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuPersonRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuPersonSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys51_specific_menu_person.xml + UpdateDataModel(sys51_specific_menu_person) */
@Mapper
public interface SysSpecificMenuPersonMapper {
    List<SpecificMenuPersonRes> selectBySpecificMenuId(@Param("specificMenuId") Long specificMenuId, @Param("specificWorkCd") String specificWorkCd);

    SpecificMenuPersonRes selectById(@Param("specificMenuPersonId") Long specificMenuPersonId);

    Long selectNextId();

    int insertSpecificMenuPerson(@Param("specificMenuPersonId") Long specificMenuPersonId, @Param("specificMenuId") Long specificMenuId,
                                 @Param("req") SpecificMenuPersonSaveReq req);

    int updateSpecificMenuPerson(@Param("companyId") Long companyId, @Param("specificMenuId") Long specificMenuId,
                                 @Param("req") SpecificMenuPersonSaveReq req);

    int deleteSpecificMenuPersons(@Param("companyId") Long companyId, @Param("specificMenuId") Long specificMenuId,
                                  @Param("specificMenuPersonIds") List<Long> specificMenuPersonIds);

    /** updateGroup: 그 회사·특정업무의 모든 사원권한 지우기 (AS-IS deleteSpecificMenuPerson) */
    int deleteByWork(@Param("companyId") Long companyId, @Param("specificWorkCd") String specificWorkCd);

    /** updateGroup: 그 회사·특정업무의 모든 매뉴에 사원 한 명씩 넣기 (AS-IS insertSpecificMenuPerson) */
    int insertByWork(@Param("companyId") Long companyId, @Param("specificWorkCd") String specificWorkCd,
                     @Param("personId") Long personId, @Param("useYn") String useYn, @Param("note") String note);

    /** 이 매뉴가 그 회사 것인지 (회사 범위 보강) */
    int countMenu(@Param("companyId") Long companyId, @Param("specificMenuId") Long specificMenuId);
}
