package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.AdviceMemberRes;
import kr.co.kfs.asseterp.biz.sys.dto.AdviceMemberSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysAdviceMemberMapper {

    /** AS-IS sys91_advice_member.selectByAll */
    List<AdviceMemberRes> selectByAll();

    /** AS-IS sys91_advice_member.selectById (저장 뒤 다시 읽기) */
    AdviceMemberRes selectById(@Param("adviceMemberId") Long adviceMemberId);

    /** AS-IS dbConfig.getSeq (= f_create_seq) */
    Long selectNextId();

    int insertAdviceMember(@Param("id") Long id, @Param("r") AdviceMemberSaveReq req);

    int updateAdviceMember(@Param("r") AdviceMemberSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deleteAdviceMembers(@Param("ids") List<Long> ids);
}
