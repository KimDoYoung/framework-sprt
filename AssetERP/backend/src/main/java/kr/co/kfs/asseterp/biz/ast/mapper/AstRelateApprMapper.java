package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.RelateApprRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast80_relate_appr.xml — 연관문서(고유자산) */
@Mapper
public interface AstRelateApprMapper {
    /** selectByCompanyId */
    List<RelateApprRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("date") LocalDate date, @Param("linkCode") String linkCode);

    /** dbConfig.getSeq */
    long selectNextId();

    /** insert */
    int insert(@Param("relateApprId") long relateApprId, @Param("companyId") Long companyId, @Param("date") LocalDate date, @Param("linkCode") String linkCode);

    /** deleteByApprId (이름과 달리 relateApprId로 지운다) */
    int deleteByApprId(@Param("relateApprId") Long relateApprId);

    /** updateApprId */
    int updateApprId(@Param("relateApprId") Long relateApprId, @Param("apprId") Long apprId);
}
